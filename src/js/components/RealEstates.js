import { gql } from 'graphql-request';
import Template from './Template.js';
import Filter from './Filter.js';
import * as Tools from '../tools.js';
import RealEstateDetail from './RealEstateDetail.js';
import RealEstateBase from './RealEstateBase.js';

/**
 * Handle real estates rendering.
 */
class RealEstates extends RealEstateBase {
    /**
     * Construct.
     * @param el
     */
    constructor(el, options = {}) {
        super();

        this.el = el;
        this._defaultSettings = {
            template: 'layoutTile',
            limit: 0,
            pagination: false,
            more: true,
            moreShow: true,
            moreInitial: 3,
            moreItems: 6,
        };
        this._customSettings = options;

        this._init();

        window.addEventListener('resize', Tools.debounce(() => this._init()));

        this._attachFilter();

        this._setTemplates();

        if (this.templates.detail) {
            this.detail = new RealEstateDetail({
                template: this.templates.detail,
            });

            this._applyClickListener();
        }

        this.loadData();
    }

    /**
     * Init optional functionalities.
     *
     * @private
     */
    _init() {
        this._settings = Tools.mapOptions(this._defaultSettings, this._customSettings);

        if (this._settings.medias) {
            let mediaOptions = Tools.getMediaOptions(this._settings.medias);

            if (mediaOptions) {
                this._settings = Tools.mapOptions(this._settings, mediaOptions);
            }
        }

        this._applyPagination();
        this._applyMoreButton();

        this.render();
    }

    /**
     * Get template nodes.
     * @private
     */
    _setTemplates() {
        this.templates = {};
        let templates = this.el.querySelectorAll('template');

        this._templateClasses = new Set();

        templates.forEach(el => {
            this.templates[el.dataset.templateName] = new Template(el);
        });
    }

    /**
     * Attach filter form to current instance.
     * @private
     */
    _attachFilter() {
        let filter = this.el.dataset.realEstatesFilter;

        if (filter) {
            try {
                filter = document.querySelector(filter);

                this.filterForm = new Filter(filter);
                this.filter = this.filterForm.getFilter();

                filter.addEventListener('filter', e => this._filterListener(e));
            } catch (error) {
                console.warn('Filter not found!');
                console.log(error);
            }
        }
    }

    /**
     * Apply click listener to current instance.
     * @private
     */
    _applyClickListener() {
        this.el.addEventListener('click', Tools.delegate('[data-table-sort-value]', (e) => {
            let button = e.target.closest('[data-table-sort-value]');
            let value = button.dataset.tableSortValue;

            if (!this._tableSettings) {
                this._tableSettings = {};
            }

            let order = this._tableSettings.order === 'asc' && this._tableSettings.key === value ? 'desc' : 'asc';

            switch (value) {
                case 'usable_area':
                case 'prize':
                    this.render({
                        sortCallback:
                            order === 'asc'
                                ? (a, b) => a[value] - b[value]
                                : (a, b) => b[value] - a[value],
                    });
                    break;
                default:
                    this.render({
                        sortCallback:
                            order === 'asc'
                                ? Tools.sortBy(value)
                                : (a, b) => Tools.sortBy(value)(a, b) * -1,
                    });
            }

            let sortButtons = this.el.querySelectorAll(`[data-table-sort-value="${value}"]`);
            sortButtons.forEach(el => el.classList.add(order));

            this._tableSettings.key = value;
            this._tableSettings.order = order;
        }));
    }

    /**
     * Listen for filter events from filter form.
     * @param e
     * @private
     */
    _filterListener(e) {
        this.filter = e.detail.Filter.filters;

        if (e.detail.Filter.filters.template) {
            this._settings.template = e.detail.Filter.filters.template.layout;
            let templateClass = `template-${Tools.camelToKebabCase(e.detail.Filter.filters.template.layout)}`;

            this.el.classList.remove(...this._templateClasses);

            this.el.classList.add(templateClass);

            this._templateClasses.add(templateClass);
        }

        let callback;

        if (this.filter.sort.sorting) {
            switch (this.filter.sort.sorting) {
                case 'dateAsc':
                    callback = Tools.sortBy('updated_at');
                    break;
                case 'dateDesc':
                    callback = (a, b) => Tools.sortBy('updated_at')(a, b) * -1;
                    break;
                case 'prizeAsc':
                    callback = Tools.sortBy('prize');
                    break;
                case 'prizeDesc':
                    callback = (a, b) => Tools.sortBy('prize')(a, b) * -1;
                    break;
            }
        }

        delete this._pagination;
        delete this._more;
        this._applyPagination();
        this._applyMoreButton();

        if (callback) {
            this.render({
                sortCallback: callback,
            });
        } else {
            this.render();
        }
    }

    /**
     * Load data from GraphQL API.
     * @returns {Promise<void>}
     */
    async loadData() {
        let query = gql`
            {
                refTypes {
                    id
                    title
                }
                estates {
                    id
                    ref_type_id
                    title
                    prize
                    zip
                    city
                    canton
                    country
                    availability
                    usable_area
                    estate_type
                    description
                    updated_at
                    images {
                        image_path
                        title
                        filename
                    }
                }
            }
        `;

        let response = await this._client.request(query);
        this.estates = response.estates;

        /**
         * Dispatched when data has been loaded.
         *
         * @event RealEstates#realEstateDataLoaded
         */
        this.el.dispatchEvent(new Event('realEstateDataLoaded'));

        if (this.filterForm) {
            this._createOptionsEstates(response);
        }

        this.render();
    }

    /**
     * Apply pagination.
     * @private
     */
    _applyPagination() {
        if (this._paginationElement) {
            this._paginationElement.remove();
        }

        if (this._settings.pagination) {
            this._pagination = {
                current: this._pagination && this._pagination.current ? this._pagination.current : 1,
            };

            this._createPagination();
        } else {
            delete this._paginationElement;
            delete this._pagination;
        }
    }

    /**
     * Create pagination element.
     * @private
     */
    _createPagination() {
        let pagination = document.createElement('div');
        pagination.classList.add('pagination', 'base-width');
        let html = `<button class="pagination__button pagination__button--prev link" data-pagination="prev">
                        <span class="link__icon"><span class="icon-chevron"></span></span>
                        <span class="link__text">Zurück</span>
                    </button>
                    <button class="pagination__button pagination__button--next link" data-pagination="next">
                        <span class="link__text">Seite
                            <span class="pagination__current"></span> von
                            <span class="pagination__total"></span>
                        </span>
                        <span class="link__icon"><span class="icon-chevron"></span></span>
                    </button>`;

        pagination.innerHTML = html;

        pagination.addEventListener('click', Tools.delegate('[data-pagination]', (e) => {
            let button = e.target.closest('[data-pagination]');
            switch (button.dataset.pagination) {
                case 'next':
                    this._pagination.current = Math.min(this._pagination.current + 1, this._pagination.total);
                    break;
                case 'prev':
                    this._pagination.current = Math.max(this._pagination.current - 1, 1);
                    break;
                default:
                    this._pagination.current = Math.min(
                        Math.max(
                            parseInt(button.dataset.pagination), 0
                        ), this._pagination.total
                    );
            }

            this.render();

            this._updatePaginationButtons();
        }));

        this._paginationElement = pagination;

        if (this.el.parentNode.nextElementSibling) {
            this.el.parentNode.parentNode.insertBefore(this._paginationElement, this.el.parentNode.nextElementSibling);
        } else {
            this.el.parentNode.appendChild(this._paginationElement);
        }
    }

    /**
     * Apply more button.
     * @private
     */
    _applyMoreButton() {
        if (this._moreElement) {
            this._moreElement.remove();
        }

        if (this._settings.more) {
            this._more = {
                show: this._more && this._more.show ? this._more.show : this._settings.moreInitial,
            };

            this._createMoreButton();
        } else {
            delete this._moreElement;
            delete this._more;
        }
    }

    /**
     * Create more button.
     * @private
     */
    _createMoreButton() {
        let button = document.createElement('div');
        button.classList.add('show-more', 'base-width');
        let html = '<button class="button button--w100 button--block" data-estate-more>Mehr laden</button>';

        button.innerHTML = html;

        button.addEventListener('click', () => {
            this._more = {
                show: this._settings.moreItems === 0 ? 0 : this._more.show + this._settings.moreItems,
            };

            this.render();
        });

        this._moreElement = button;

        if (this.el.parentNode.nextElementSibling) {
            this.el.parentNode.parentNode.insertBefore(this._moreElement, this.el.parentNode.nextElementSibling);
        } else {
            this.el.parentNode.appendChild(this._moreElement);
        }
    }

    /**
     * Update pagination button content.
     * @private
     */
    _updatePaginationButtons() {
        if (this.filter.template.layout === 'layoutList') {
            this._paginationElement.classList.add('hide');
        } else {
            this._paginationElement.classList.remove('hide');
            this._paginationElement.querySelector('.pagination__total').innerHTML = this._pagination.total;
            this._paginationElement.querySelector('.pagination__current').innerHTML = this._pagination.current;

            let prev = this._paginationElement.querySelector('.pagination__button--prev');
            if (this._pagination.current === 1) {
                prev.disabled = true;
            } else {
                prev.removeAttribute('disabled');
            }

            let next = this._paginationElement.querySelector('.pagination__button--next');
            if (this._pagination.current === this._pagination.total) {
                next.disabled = true;
            } else {
                next.removeAttribute('disabled');
            }
        }
    }

    /**
     * Create select options from collected estates.
     * @private
     */
    _createOptionsEstates(obj) {
        let cantonSet = new Set();
        for (let item of obj.estates) {
            cantonSet.add(item.canton);
        }

        let cantons = Array.from(cantonSet).map(item => this._getSelectOptionObjectFromItem(item));
        cantons = Array.from(cantons);

        let refTypes = Array.from(obj.refTypes).map(item => this._getSelectOptionObjectFromItem(item));

        let emptyAll = {
            inner: 'Alle',
            attributes: {
                value: '',
            },
        };

        cantons.unshift(emptyAll);
        refTypes.unshift(emptyAll);

        this.filterForm.updateSelectOptions('canton', cantons);
        this.filterForm.updateSelectOptions('ref_type_id', refTypes);
    }

    /**
     * Get formatted select option object from single item.
     * @param item
     * @returns {{attributes: {value: *}, inner}}
     * @private
     */
    _getSelectOptionObjectFromItem(item) {
        return {
            inner: item.title ? item.title : item,
            attributes: {
                value: item.id ? item.id : item,
            },
        };
    }

    /**
     * Render current estates.
     *
     * @param options
     * @param {{sortCallback: (function(*, *))}} options
     */
    render(options = {
        sortCallback: Tools.sortBy('updated_at'),
    }) {
        if (!this.estates) {
            return;
        }

        this.el.innerHTML = '';
        let estates = this.estates;

        let callbacks = this.filter ? this.filter.filterCallback : false;

        if (callbacks) {
            Object.keys(callbacks).reduce((prev, current) => {
                if (this[current]) {
                    estates = estates.filter((item) => this[current](item));
                }

                return estates;
            }, estates);
        }

        let items = [];

        estates = estates.filter(estate => this._matchesFilter(estate));

        if (options.sortCallback) {
            estates.sort(options.sortCallback);
        }

        for (let estate of estates) {
            estate = this._getFormattedObject(estate);

            let item = this.templates[this._settings.template].create(estate);

            item.firstElementChild.dataset.id = estate.id;

            items.push(item);
        }

        if (this._settings.limit > 0) {
            items = items.slice(0, this._settings.limit);
        }

        if (this._settings.pagination) {
            if (this.filter && this.filter.template.layout !== 'layoutList') {
                this._pagination.total = Math.ceil(items.length / this._settings.paginationItemsPerPage);
                let start = this._settings.paginationItemsPerPage * (this._pagination.current - 1);
                let end = start + this._settings.paginationItemsPerPage;

                items = items.slice(start, end);
            }

            this._updatePaginationButtons();
        }

        if (this._settings.more) {
            if (this.filter && this.filter.template.layout === 'layoutList') {
                this._moreElement.classList.add('hide');
            } else {
                this._moreElement.classList.remove('hide');

                if (this._more.show >= items.length || this._more.show === 0) {
                    this._moreElement.remove();
                }

                items = items.slice(0, this._more.show);
            }
        }

        if (items[0] && items[0].firstElementChild.tagName === 'TR') {
            let tBody = document.createElement('tbody');
            items.forEach(item => tBody.appendChild(item));

            let table;

            if (this.templates.table) {
                table = this.templates['table'].create({
                    tableRows: tBody.innerHTML,
                });
            } else {
                table = document.createElement('table');

                table.appendChild(tBody);
            }

            this.el.appendChild(table);
        } else {
            items.forEach(item => this.el.appendChild(item));
        }
    }

    /**
     * Check if current item matches filter.
     * @param obj
     * @returns {boolean}
     * @private
     */
    _matchesFilter(obj) {
        if (!this.filter) {
            return true;
        }

        let filter = this.filter.filter;

        let matches = Object.keys(filter).reduce((prev, current) => {
            // eslint-disable-next-line eqeqeq
            return prev && filter[current] == obj[current];
        }, true);

        return matches;
    }
}

export default RealEstates;
