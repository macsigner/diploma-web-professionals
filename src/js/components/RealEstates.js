import { GraphQLClient, gql } from 'graphql-request';
import Template from './Template.js';
import Filter from './Filter.js';
import * as Tools from '../tools.js';
import RealEstateDetail from './RealEstateDetail.js';

/**
 * Handle real estates rendering.
 */
class RealEstates {
    /**
     * Construct.
     * @param el
     */
    constructor(el, options = {}) {
        this.el = el;
        this._defaultSettings = {
            template: 'layoutTile',
            limit: 0,
        };
        this._customSettings = options;
        this._settings = Tools.mapOptions(this._defaultSettings, this._customSettings);

        if (this.el.dataset.realEstatesLimit) {
            this._settings.limit = parseInt(this.el.dataset.realEstatesLimit);
        }

        this._attachFilter();

        this._setTemplates();

        this.client = new GraphQLClient('https://dev22-api.web-professionals.ch/graphql');

        if (this.templates.detail) {
            this.detail = new RealEstateDetail({
                template: this.templates.detail,
            });

            this._applyClickListener();
        }

        this.loadData();
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

        let response = await this.client.request(query);
        this.estates = response.estates;

        if (this.filterForm) {
            this._createOptionsEstates(response);
        }

        this.render();
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
            estate.image = estate.images[0];

            estate.link = `./detail.html?estate=${estate.id}`;

            let item = this.templates[this._settings.template].create(estate);

            item.firstElementChild.dataset.id = estate.id;

            items.push(item);
        }

        if (this._settings.limit > 0) {
            items = items.slice(0, this._settings.limit);
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
