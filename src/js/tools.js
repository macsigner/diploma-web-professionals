/**
 * Delegate event to specified selector only.
 * @param selector
 * @param fn
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
 * @param fn
 * @param delay
 * @returns {(function(): void)|*}
 */
const debounce = (fn, delay = 300) => {
    let timout;

    return () => {
        clearTimeout(timout);

        setTimeout(fn, delay);
    };
};

export {
    delegate,
    debounce,
};
