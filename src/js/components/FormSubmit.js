import { gql, GraphQLClient } from 'graphql-request';
import SETTINGS from '../settings.js';
import * as Tools from '../tools.js';
import Alert from './Alert.js';

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

        this._loadFormData();

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

            let isValid = this.validate();

            let obj = this._getFormDataObject();

            if (isValid) {
                let mutation = this._mutate(obj);

                mutation.then((response) => {
                    this._form.classList.add('submitted');

                    window.localStorage.removeItem('formData');
                    this._form.reset();

                    console.log(response.createMessage);
                }).catch(error => {
                    this._saveFormData();

                    let mailBody = Object.keys(obj)
                        .reduce((prev, key) => `${prev}\n${key}: ${obj[key]}`, '');
                    new Alert({
                        title: 'Ein Fehler ist aufgetreten',
                        message: `
                                <pre class="error">${error}</pre>

                                <p>Die Formulardaten wurden lokal in Ihrem Broswer gespeichert.<br>

                                Sie können es später erneut versuchen oder die  Daten per Mail übermitteln.</p>

                                <a href="mailto:info@homehouse.ch?body=${encodeURIComponent(mailBody)}"
                                    class="button button--block">Daten per Mail übermitteln</a>
                            `,
                    }, {
                        appendTo: this._form.parentNode,
                    });
                });
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
            mutation(
                $estate_id: ID!,
                $firstname: String!,
                $lastname: String!,
                $address: String!,
                $postalcode: String!,
                $city: String!,
                $phonenumber: String!,
                $email: String!,
                $content: String!,
                $information: Boolean,
                $visit: Boolean
            ) {
                createMessage(
                    estate_id: $estate_id
                    firstname: $firstname
                    lastname: $lastname
                    address: $address
                    postalcode: $postalcode
                    city: $city
                    phonenumber: $phonenumber
                    email: $email
                    content: $content
                    information: $information
                    visit: $visit
                ) {
                    address
                    city
                    content
                    created_at
                    email
                    estate {
                        title,
                    }
                    firstname
                    id
                    information
                    lastname
                    phonenumber
                    postalcode
                    updated_at
                    visit
                }
            }
        `;

        let requiredFields = {
            firstname: '',
            lastname: '',
            address: '',
            postalcode: '',
            city: '',
            phonenumber: '',
            email: '',
            content: '',
            information: false,
            visit: false,
        };

        let messageData = Object.assign(requiredFields, data);

        return await this._client.request(createMessage, messageData);
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

            this._saveFormData();
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

    /**
     * Save form data to local storage.
     *
     * @private
     */
    _saveFormData() {
        let obj = this._getFormDataObject();

        window.localStorage.setItem('formData', JSON.stringify(obj));
    }

    /**
     *
     * @returns {any|Object} Form data object
     * @private
     */
    _loadFormData() {
        let json = window.localStorage.getItem('formData');

        if (!json) {
            return;
        }

        let data = JSON.parse(json);

        Array.from(this._form.elements).forEach(el => {
            if (data[el.name]) {
                switch (el.type) {
                    case 'checkbox':
                    case 'radio':
                        el.checked = !!data[el.name];
                        break;
                    default:
                        el.value = data[el.name];
                }
            }
        });

        return data;
    }

    /**
     * Get current form data as object.
     *
     * @returns {Object} Form data as object
     * @private
     */
    _getFormDataObject() {
        let formData = new FormData(this._form);

        let obj = {};

        for (let [key, entry] of formData.entries()) {
            switch (key) {
                case 'information':
                case 'visit':
                    obj[key] = !!entry;
                    break;
                default:
                    obj[key] = entry;
            }
        }

        return obj;
    }
}

export default FormSubmit;
