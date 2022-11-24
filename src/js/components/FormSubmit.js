import { gql, GraphQLClient } from 'graphql-request';
import SETTINGS from '../settings.js';
import * as Tools from '../tools.js';

/**
 * Form submission via mutate.
 */
class FormSubmit {
    /**
     * Construct.
     * @param el {HTMLFormElement} Form element
     */
    constructor(el) {
        this._client = new GraphQLClient(SETTINGS.gqlURL);
        this._form = el;

        this._form.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', Tools.debounce((e) => this._inputListener(e), 1200));
            input.addEventListener('blur', Tools.debounce((e) => this._inputListener(e), 1200));
        });

        this._form.addEventListener(
            'click',
            Tools.delegate('[type=submit], button', () => this.validate())
        );

        this._form.addEventListener('submit', (e) => {
            console.log('submit');
            e.preventDefault();

            let formData = new FormData(this._form);

            let isValid = this.validate();

            let obj = {};

            for (let [key, entry] of formData.entries()) {
                obj[key] = entry;
            }

            if (isValid) {
                console.log('is valid');
                console.log(isValid);
            }
        });
    }

    /**
     * Mutate
     * @returns {Promise<void>}
     * @private
     */
    async _mutate(data) {
        let createMessage = gql`
            type Mutation {
                createMessage(
                    estate_id: ID!
                    fristname: String!
                    lastname: String!
                    address: String!
                    postalcode: String!
                    city: String!
                    phonenumber: String!
                    email: String!
                    content: String
                    information: Boolean
                    visit: Boolean
                ): Message!
            }
        `;

        let response = await this._client.request(createMessage, data);

        console.log(response);
    }

    /**
     * Listen for input changes.
     *
     * @param e {Event} Input or blur event
     * @private
     */
    _inputListener(e) {
        this.validateField(e.target);
    }

    /**
     * Validate single field.
     *
     * @param el {HTMLInputElement} Single input field
     */
    validateField(el) {
        el.setCustomValidity('');
        let isValid = el.checkValidity();
        let container = el.closest('.input') || el;

        if (isValid) {
            container.classList.add('is-valid');
            container.classList.remove('is-invalid');
        } else {
            let message;

            if (el.value.trim() === '') {
                message = 'Dies ist ein Pflichtfeld. Bitte füllen sie es aus.';
            } else {
                container.classList.remove('is-valid');
                container.classList.add('is-invalid');

                switch (el.name) {
                    case 'phonenumber':
                        message = 'Bitte geben sie eine gültige Telefonnummer ein';
                        break;
                    default:
                        message = 'Ungültige Angaben.';
                }
            }

            el.setCustomValidity(message);
            el.checkValidity();
        }

        if (el.value.trim() === '' && el.required) {
            container.classList.remove('is-valid');
            container.classList.add('is-invalid');
        } else if (!el.required) {
            container.classList.remove('is-valid');
            container.classList.remove('is-invalid');
        }
    }

    /**
     * Validate current form.
     */
    validate() {
        let fields = Array.from(this._form.elements);

        return fields.reduce((prev, current) => {
            this.validateField(current);

            return prev && current.checkValidity();
        }, true);
    }
}

export default FormSubmit;
