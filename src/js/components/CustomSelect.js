import * as Tools from '../tools.js';

/**
 * Customizable select menu.
 */
class CustomSelect {
    /**
     * Construct.
     * @param el
     */
    constructor(el) {
        this.el = el;
        this.el.classList.add('custom-select-original');

        this.customSelect = document.createElement('dl');
        this.current = document.createElement('dt');
        this.customOptions = document.createElement('dd');
        this.customSelect.appendChild(this.current);
        this.customSelect.appendChild(this.customOptions);

        this.menu = this._createListFromItem(this.el);
        this.customOptions.appendChild(this.menu);

        this.customSelect.setAttribute('tabindex', this.el.tabIndex);

        if (this.el.nextElementSibling) {
            this.el.parentNode.insertBefore(this.customSelect, this.el.nextElementSibling);
        } else {
            this.el.parentNode.appendChild(this.customSelect);
        }

        // Focus on custom selection if focus is set on main select otherwise.
        this.el.addEventListener('focus', () => {
            this.customSelect.focus();
        });

        this.customSelect.addEventListener('focus', () => this.open());

        this.customSelect.addEventListener('click', Tools.delegate(
            '[data-value]',
            (e) => {
                this.select(e.target.closest('[data-value]').dataset.value);
            }
        ));

        this.customSelect.addEventListener('change', () => {
            this.el.value = this.getCurrentValue();

            // Dispatch event for other listeners on select item itself.
            this.el.dispatchEvent(new Event('change', {
                bubbles: true,
            }));
        });
    }

    /**
     * Open options menu.
     */
    open() {
        this.customSelect.classList.add('open');
    }

    /**
     * Close options menu.
     */
    close() {
        this.customSelect.classList.remove('open');
    }

    /**
     * Select specified value.
     * @param value
     */
    select(value) {
        this._value = value;

        this.customOptions.querySelector(`[data-value="${value}]"`);

        this.customSelect.dispatchEvent(new CustomEvent('change',
            {
                detail: {
                    CustomSelect: this,
                },
            }
        ));

        this.close();
    }

    /**
     * Get current value.
     * @returns {*}
     */
    getCurrentValue() {
        return this._value;
    }

    /**
     * Create unordered list from node.
     * @param el
     * @returns {*}
     * @private
     */
    _createListFromItem(el, indexPrefix = '') {
        let children = Array.from(el.children);
        let list = document.createElement('ul');

        children.forEach((child, i) => {
            let listItem = document.createElement('li');
            listItem.dataset.index = indexPrefix + i;

            if (child.tagName.toLowerCase() === 'optgroup') {
                listItem.innerHTML = child.label;

                listItem.appendChild(this._createListFromItem(child, i + '-'));
            } else {
                listItem.dataset.value = child.value;
                listItem.innerHTML = child.innerHTML;
            }

            list.appendChild(listItem);
        });

        return list;
    }
}

export default CustomSelect;
