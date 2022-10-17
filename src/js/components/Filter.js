import CustomSelect from './CustomSelect.js';
import * as Tools from '../tools.js';

/**
 * Filter.
 */
class Filter {
    /**
     * Construct.
     * @param {Element} el
     */
    constructor(el) {
        this._form = el;
        this.filters = {};

        this._form.addEventListener('submit', this._formListener.bind(this));
        this._form.addEventListener('change', this._formListener.bind(this));

        let selectFields = this._form.querySelectorAll('select');

        selectFields.forEach(el => new CustomSelect(el));
    }

    /**
     * Handle form submissions/changes.
     * @param {Event} e
     * @private
     */
    _formListener(e) {
        e.preventDefault();

        let formData = new FormData(this._form);

        for (let entry of formData.entries()) {
            let filterType = this._getInputFilterType(entry[0]);

            if (filterType && !this.filters[filterType]) {
                this.filters[filterType] = {};
            }

            this.filters[filterType][entry[0]] = entry[1];
        }

        this.filters = Tools.cleanEmptyStringsFromObject(this.filters);

        this._form.dispatchEvent(new CustomEvent('filter', {
            detail: {
                Filter: this,
                currentFilter: this.filters,
            },
        }));
    }

    /**
     * Get input type of filter element.
     * @param key
     * @returns {string|string}
     * @private
     */
    _getInputFilterType(key) {
        let el = this._form.querySelector(`[name="${key}"]`);

        return el.dataset.filterType ? el.dataset.filterType : 'filter';
    }
}

export default Filter;
