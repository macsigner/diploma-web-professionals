/**
 * Delegate event to specified selector only.
 * @param {string} selector
 * @param {*} fn
 * @returns {(function(*): void)|*}
 */
const delegate = (selector, fn) => {
    return (e) => {
        if (e.target.closest(selector)) {
            fn(e);
        }
    };
};

/**
 * Debounce function.
 * @param {string | Function} fn
 * @param {number} delay
 * @returns {(function(): void)|*}
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
 * @param key
 * @returns {(function(*, *): (number))|*}
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
 * @param obj
 * @returns {*}
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

export {
    delegate,
    debounce,
    sortBy,
    cleanEmptyStringsFromObject,
};
