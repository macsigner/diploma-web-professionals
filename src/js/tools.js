/**
 * Creates a function that delegates given event to specified selector only.
 *
 * @param {string} selector CSS query selector
 * @param {*} fn Callback function run if selector matches
 * @returns {function(): void} Function to be run on event
 */
const delegate = (selector, fn) => {
    return (e) => {
        if (e.target.closest(selector)) {
            fn(e);
        }
    };
};

/**
 * Create a debounce function.
 * @param {function} fn Function to be run after debounce
 * @param {number} delay Delay in milliseconds
 * @returns {function(): void} Function to be called after interaction
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
 * @param {string|number} key Key of object or array given
 * @returns {function(*, *): number} Function to be called on each comparison
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
