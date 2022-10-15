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
            template: 'tile',
        };

        this.client = new GraphQLClient('https://dev22-api.web-professionals.ch/graphql');

        this.loadData();

        this.templates = {};
        let templates = this.el.querySelectorAll('template');

        templates.forEach(el => {
            this.templates[el.dataset.templateName] = new Template(el);
        });
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

        for (let estate of this.estates) {
            estate.image = estate.images[0];

            let item = this.templates[this._settings.template].create(estate);

            this.el.appendChild(item);
        }
    }
}

export default RealEstates;
