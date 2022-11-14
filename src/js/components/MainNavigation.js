import * as Tools from '../tools.js';

/**
 * Handle the main navigation and triggers.
 */
class MainNavigation {
    /**
     * Construct.
     */
    constructor(navigationArea, options = {
        toggleSelector: '[data-main-navigation-toggle]',
    }) {
        this.el = navigationArea;
        this._settings = options;

        document.addEventListener(
            'click',
            Tools.delegate(this._settings.toggleSelector, this._toggleListener.bind(this))
        );
    }

    /**
     * Toggle states and css classes for main navigation visibility.
     * @param e
     * @private
     */
    _toggleListener() {
        document.documentElement.classList.toggle('main-navigation-area-is-open');
        this.el.classList.toggle('is-open');

        document.querySelectorAll(this._settings.toggleSelector).forEach(el => el.classList.toggle('is-active'));
    }
}

export default MainNavigation;
