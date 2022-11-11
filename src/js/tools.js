/** @module Tools */

/**
 * Creates a function that delegates given event to specified selector only.
 *
 * @param {String} selector CSS query selector
 * @param {Function({Event})} fn Callback function run if selector matches
 * @returns {Function(): void} Function to be run on event
 */
const delegate = (selector, fn) => {
    return (e) => {
        if (e.target.closest(selector)) {
            fn(e);
        }
    };
};

/**
 * Create a debounce function that runs after set delay.
 *
 * @param {Function} fn Function to be run after debounce
 * @param {Number} delay Delay in milliseconds
 * @returns {Function(): void} Function to be called after interaction
 */
const debounce = (fn, delay = 300) => {
    let timout;

    return () => {
        clearTimeout(timout);

        setTimeout(fn, delay);
    };
};

/**
 * Sort object by specified key.
 *
 * @param {String|Number} key Key of object or array given
 * @returns {Function({Object}, {Object}): Number} Function to be called on each comparison
 */
const sortBy = (key) => {
    return (a, b) => {
        if (a[key] > b[key]) {
            return 1;
        } else if (a[key] < b[key]) {
            return -1;
        }

        return 0;
    };
};

/**
 * Clean empty strings from object.
 *
 * @param obj {Object} Object to be cleaned from empty strings
 * @returns {Object} Object with empty string properties removed
 */
const cleanEmptyStringsFromObject = (obj) => {
    for (let key of Object.keys(obj)) {
        if (obj[key] === '') {
            delete obj[key];
        } else if (typeof obj[key] === 'object') {
            obj[key] = cleanEmptyStringsFromObject(obj[key]);
        }
    }

    return obj;
};

/**
 * Map options object deep.
 *
 * @param originalOptions {Object} Original options object
 * @param newOptions {Object} New options object that will overwrite correlating values
 * @returns {Object}
 */
const mapOptions = (originalOptions, newOptions) => {
    let settings = Object.assign({}, originalOptions);

    if (Array.isArray(originalOptions)) {
        settings = originalOptions.map((x) => x);
    } else {
        settings = Object.assign({}, originalOptions);
    }

    Object.keys(newOptions).forEach((strKey) => {
        if (typeof newOptions[strKey] === 'object'
            && !(newOptions[strKey] instanceof Node)
            && !(newOptions[strKey] instanceof Function)
        ) {
            settings[strKey] = this.mapOptions(settings[strKey], newOptions[strKey]);
        } else {
            settings[strKey] = newOptions[strKey];
        }
    });

    return settings;
};

/**
 * Convert camel case string to kebab case.
 * @param {String} str Camel case string
 * @returns {string} Kebab case string.
 */
function camelToKebabCase(str) {
    if (str !== str.toLowerCase()) {
        str = str.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
    }

    return str;
}

export {
    delegate,
    debounce,
    sortBy,
    cleanEmptyStringsFromObject,
    mapOptions,
    camelToKebabCase,
};
