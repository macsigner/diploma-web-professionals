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

export {
    delegate,
};
