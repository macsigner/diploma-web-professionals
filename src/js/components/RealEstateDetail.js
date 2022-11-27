import { gql } from 'graphql-request';
import * as Tools from '../tools.js';
import Slider from './Slider.js';
import Modal from './Modal.js';
import GoogleMap from './GoogleMap.js';
import RealEstates from './RealEstates.js';
import Template from './Template.js';
import RealEstateBase from './RealEstateBase.js';
import FormSubmit from './FormSubmit.js';

/**
 * Real estate detail view.
 */
class RealEstateDetail extends RealEstateBase {
    /**
     * Construct.
     *
     * @param options
     */
    constructor(el, options = {}) {
        super();

        this.el = el;
        this._defaultSettings = {
            namespace: 'real-estate-detail',
        };

        this._customSettings = options;
        this._settings = Tools.mapOptions(this._defaultSettings, this._customSettings);

        this._settings.template = this._customSettings.template;
    }

    /**
     * Open estate id.
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

        estate = this._getFormattedObject(estate);

        this._data = estate;

        let el = this._settings.template.create(estate);

        let htmlTemplate = el.querySelector('#contact-form template');

        if (htmlTemplate) {
            let template = new Template(htmlTemplate);

            htmlTemplate.parentNode.appendChild(template.create(estate));

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
            limit: 2,
            more: false,
            moreShow: false,
            medias: [
                {
                    media: '(min-width: 56.25em)',
                    settings: {
                        limit: 3,
                    },
                },
            ],
        }));

        let contactModalContent = el.querySelector('[data-real-estate-contact-modal]');
        if (contactModalContent) {
            let contactModal = new Modal(contactModalContent, {
                open: false,
            });

            contactModalContent.querySelectorAll('form').forEach(el => new FormSubmit(el));

            wrapper.addEventListener('click', Tools.delegate('[data-real-estate-contact]', () => {
                contactModal.open();
            }));
        }

        wrapper.appendChild(el);

        this.el.appendChild(wrapper);
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
