import * as Tools from '../tools.js';

/**
 * Smooth scroll links.
 */
class SmoothScroll {
    /**
     * Construct.
     * @param scope
     */
    constructor(scope = document.documentElement) {
        this.scope = scope;

        this.scope.addEventListener(
            'click',
            Tools.delegate('[data-smooth-scroll]', this._linkClickListener.bind(this))
        );
    }

    /**
     * Listen for click event on smooth scroll links.
     * @param e
     * @private
     */
    _linkClickListener(e) {
        let link = e.target.closest('[href]');

        if (!link) {
            return;
        }

        let target = this._getLinkTargetElement(link);

        if (!target) {
            return;
        }

        e.preventDefault();

        target.scrollIntoView({
            behavior: 'smooth',
        });
    }

    /**
     * Get target element from node.
     * @param el
     * @private
     */
    _getLinkTargetElement(el) {
        return this.scope.querySelector(el.hash);
    }
}

export default SmoothScroll;
