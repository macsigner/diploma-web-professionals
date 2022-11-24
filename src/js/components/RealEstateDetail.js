import { GraphQLClient, gql } from 'graphql-request';
import Base from './Base.js';
import * as Tools from '../tools.js';
import Slider from './Slider.js';
import Modal from './Modal.js';
import GoogleMap from './GoogleMap.js';
import RealEstates from './RealEstates.js';
import Template from './Template.js';

/**
 * Real estate detail view.
 */
class RealEstateDetail extends Base {
    /**
     * Construct.
     * @param options
     */
    constructor(options = {}) {
        super();

        this._defaultSettings = {
            namespace: 'real-estate-detail',
        };
        this._customSettings = options;
        this._settings = Tools.mapOptions(this._defaultSettings, this._customSettings);

        this._settings.template = this._customSettings.template;

        this._client = new GraphQLClient('https://dev22-api.web-professionals.ch/graphql');
    }

    /**
     *
     * @param id
     */
    async open(id = this.id) {
        if (!id) {
            return;
        }

        let query = gql`
            query getEstate($id: ID!){
                estate(id: $id) {
                    title,
                    zip,
                    city,
                    canton,
                    prize,
                    usable_area,
                    id,
                    availability,
                    description,
                    lat,
                    long
                    images {
                        image_path
                        title
                        filename
                    }
                }
            }
        `;

        let response = await this._client.request(query, {
            id: id,
        });

        let estate = response.estate;

        estate['prize_local'] = estate.prize.toLocaleString('de-CH', {
            useGrouping: true,
        });

        this._data = estate;

        let el = this._settings.template.create(estate);

        let htmlTemplate = el.querySelector('#contact-form template');

        if (htmlTemplate) {
            let template = new Template(htmlTemplate);

            htmlTemplate.parentNode.appendChild(template.create());

            htmlTemplate.remove();
        }

        let wrapper = document.createElement('div');

        el.querySelectorAll('[data-slider]').forEach(sub => new Slider(sub));
        el.querySelectorAll('[data-map]').forEach(sub => {
            new GoogleMap(sub, {
                position: {
                    lat: estate.lat,
                    lng: estate.long,
                },
                markers: [
                    {
                        title: estate.title,
                        position: {
                            lat: estate.lat,
                            lng: estate.long,
                        },
                    },
                ],
            });
        });
        el.querySelectorAll('[data-real-estates]').forEach(sub => new RealEstates(sub, {
            lat: estate.lat,
            long: estate.long,
        }));

        wrapper.appendChild(el);

        new Modal(wrapper, {
            namespace: 'detail-modal',
        });
    }

    /**
     * Get the current data.
     *
     * @returns {Object} Estate data of current instance.
     */
    getData() {
        return this._data;
    }
}

export default RealEstateDetail;
