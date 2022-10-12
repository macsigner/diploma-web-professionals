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

        this.client = new GraphQLClient('https://dev22-api.web-professionals.ch/graphql');

        this.loadData();

        let item = document.createElement('template');
        this.templates = {
            tile: new Template(item),
        };
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
                    description,
                }
            }
        `;

        this.estates = await this.client.request(query);

        this.render();
    }

    /**
     * Render current estates.
     */
    render() {
        console.log(this.estates);
    }
}

export default RealEstates;
