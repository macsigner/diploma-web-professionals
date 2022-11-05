import { GraphQLClient, gql } from 'graphql-request';
import Template from './Template.js';
import Filter from './Filter.js';
import * as Tools from '../tools.js';

/**
 * Handle real estates rendering.
 */
class RealEstates {
    /**
     * Construct.
     * @param el
     */
    constructor(el) {
        this.el = el;
        this._settings = {
            template: 'layoutTile',
        };

        this._attachFilter();

        this._setTemplates();

        this.client = new GraphQLClient('https://dev22-api.web-professionals.ch/graphql');

        this.loadData();
    }

    /**
     * Filter title by filter.
     * @param el
     * @returns {boolean}
     */
    filterTitle(item) {
        return item.title.toLowerCase().includes(this.filter.filterCallback.filterTitle);
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

        this.render();
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
     */
    render() {
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

        for (let estate of estates) {
            if (!this._matchesFilter(estate)) {
                continue;
            }

            estate.image = estate.images[0];

            let item = this.templates[this._settings.template].create(estate);

            this.el.appendChild(item);
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
