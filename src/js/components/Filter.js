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

        this.customSelects = new Set();

        selectFields.forEach(el => this.customSelects.add(new CustomSelect(el)));
    }

    /**
     * Update select options of specified key.
     * @param key
     * @param options
     */
    updateSelectOptions(key, options) {
        let customSelect = this._getCustomSelectByKey(key);

        customSelect.setOptions(options);
    }

    /**
     * Get filter values.
     * @returns {*}
     */
    getFilter() {
        let formData = new FormData(this._form);

        for (let entry of formData.entries()) {
            let filterType = this._getInputFilterType(entry[0]);

            if (filterType && !this.filters[filterType]) {
                this.filters[filterType] = {};
            }

            this.filters[filterType][entry[0]] = entry[1];
        }

        return Tools.cleanEmptyStringsFromObject(this.filters);
    }

    /**
     * Get custom select object by specified key.
     * @param key
     * @private
     */
    _getCustomSelectByKey(key) {
        let customSelect;

        for (let entry of this.customSelects.values()) {
            if (entry.getName() === key) {
                customSelect = entry;

                break;
            }
        }

        return customSelect;
    }

    /**
     * Handle form submissions/changes.
     * @param {Event} e
     * @private
     */
    _formListener(e) {
        e.preventDefault();

        this.filters = this.getFilter();

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
