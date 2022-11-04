/**
 * Base class.
 */
class Base {
    /**
     * Get the namespace class. Eg. for dynamic css class naming.
     *
     * @param suffix {string} String appended after the namespace class.
     * @param prefix {string} String prepended before the namespace class.
     * @returns {string}
     */
    getNamespace(suffix = '', prefix = '') {
        return prefix + (this._settings ? this._settings.namespace : this.settings.namespace) + suffix;
    }

    /**
     * Get the namespace class with prepended dot. Eg. for query selectors.
     *
     * @param suffix {string}
     * @param prefix
     * @returns {string}
     */
    getNamespaceClass(suffix = '', prefix = '') {
        return '.' + this.getNamespace(suffix, prefix);
    }
}

export default Base;
