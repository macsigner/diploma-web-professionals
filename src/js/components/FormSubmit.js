import { gql, GraphQLClient } from 'graphql-request';
import SETTINGS from '../settings.js';
import * as Tools from '../tools.js';
import InfoModal from './InfoModal.js';

/**
 * Form submission via mutate.
 */
class FormSubmit {
    /**
     * Construct.
     * @param el {HTMLFormElement} Form element
     */
    constructor(el) {
        this._client = new GraphQLClient(SETTINGS.gqlURL, {
            errorPolicy: 'all',
        });
        this._form = el;

        this._loadFormData();

        this._form.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', Tools.debounce((e) => this._inputListener(e), 2000));
            input.addEventListener('blur', Tools.debounce((e) => this._inputListener(e), 1200));
        });

        this._form.addEventListener(
            'click',
            Tools.delegate('[type=submit], button', () => this.validate())
        );

        this._form.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = this.validate();

            let obj = this._getFormDataObject();

            if (isValid) {
                let mutation = this._mutate(obj);

                mutation.then((response) => {
                    this._form.classList.add('submitted');

                    let summaryArray = this._getSubmissionSummary(response.createMessage);

                    summaryArray.unshift({
                        title: 'Objekt',
                        content: response.createMessage.estate.title,
                    });

                    let summary = document.createElement('div');
                    summary.classList.add('table');

                    let rows = summaryArray.reduce(
                        (prev, current) => prev + `<tr><td>${current.title}</td><td>${current.content}</td></tr>`,
                        ''
                    );

                    summary.innerHTML = `<table><tbody>${rows}</tbody></table>`;

                    new InfoModal({
                        title: 'Ihre Daten wurden versendet',
                        message: 'Ihre Angaben:',
                        custom: summary,
                    }, {
                        appendTo: this._form.parentNode,
                        variant: 'success',
                    });

                    window.localStorage.removeItem('formData');
                    this._resetForm();
                }).catch(error => {
                    this._saveFormData();

                    let mailBody = Object.keys(obj)
                        .reduce((prev, key) => `${prev}\n${key}: ${obj[key]}`, '');

                    mailBody += `\n\n Fehler:\n${error}`;

                    let title = document.querySelector('.modal__title strong').textContent.trim();
                    let mailSubject = `Interesse am Objekt ${title}`;

                    // eslint-disable-next-line
                    // Todo: Rethinking what errors should be shown.
                    new InfoModal({
                        title: 'Ein Fehler ist aufgetreten',
                        /* eslint-disable max-len */
                        message: `
                            <pre class="error">${error}</pre>

                            <p>Die Formulardaten wurden lokal in Ihrem Broswer gespeichert.<br>

                            Sie können es später erneut versuchen oder die  Daten per Mail übermitteln.</p>

                            <a href="mailto:info@homehouse.ch?body=${encodeURIComponent(mailBody)}&subject=${encodeURIComponent(mailSubject)}"
                                class="button button--block">Daten per Mail übermitteln</a>
                            `,
                        /* eslint-enable max-len */
                    }, {
                        appendTo: this._form.parentNode,
                        variant: 'alert',
                    });

                    console.error(error);
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
                    firstname
                    lastname
                    address
                    postalcode
                    city
                    phonenumber
                    email
                    content
                    information
                    visit
                    estate {
                        title,
                    }
                    id
                    created_at
                    updated_at
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
     * Reset form.
     *
     * @private
     */
    _resetForm() {
        this._form.reset();

        this._form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
        this._form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-invalid'));
    }

    /**
     * Get summary from submission.
     *
     * @param data {Object} Object from submission
     * @returns {Object[]} Array of objects with title and content
     * @private
     */
    _getSubmissionSummary(data) {
        let contentArray = [];

        for (let key of Object.keys(data)) {
            let field = this._getFieldByName(key);

            // Check if field is visible in form
            if (!field || field.disabled) {
                continue;
            }

            let content;

            switch (field.type) {
                case 'checkbox':
                    content = data[key] ? 'ja' : 'nein';
                    break;
                default:
                    content = data[key];
            }

            let label = this._getLabelByName(key);

            if (label && content) {
                contentArray.push({
                    title: label,
                    content,
                });
            }
        }

        return contentArray;
    }

    /**
     * Get single label content by name of input field.
     *
     * @param name {String}
     * @returns {String}
     * @private
     */
    _getLabelByName(name) {
        let label = this._form.querySelector(`label[for="${name}"]`);
        let content;
        if (label) {
            content = label.textContent;
        } else {
            content = this._getFieldByName(name).closest('label').textContent;
        }

        return content.replace('\n', '').trim();
    }

    /**
     * Get input element by name.
     *
     * @param name {String}
     * @returns {HTMLElement} Field element
     * @private
     */
    _getFieldByName(name) {
        return this._form.querySelector(`[name="${name}"]`);
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
