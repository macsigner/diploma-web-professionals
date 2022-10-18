import { GraphQLClient, gql } from 'graphql-request';
import Template from './Template.js';

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

                filter.addEventListener('filter', e => this._filterListener(e));
            } catch {
                console.warn('Filter not found!');
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
                estates {
                    id,
                    title,
                    prize,
                    zip,
                    city,
                    canton,
                    country,
                    availability,
                    usable_area,
                    estate_type
                    description,
                    images {
                        image_path,
                        title,
                        filename,
                    }
                }
            }
        `;

        let response = await this.client.request(query);
        this.estates = response.estates;

        this.render();
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

        return Object.keys(filter).reduce((prev, current) => {
            return prev && filter[current] === obj[current];
        }, true);
    }
}

export default RealEstates;
