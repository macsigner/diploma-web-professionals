import * as Tools from '../tools.js';
import Base from './Base.js';

/**
 * Customizable select menu.
 */
class CustomSelect extends Base {
    /**
     * Construct.
     * @param el
     */
    constructor(el, options = {}) {
        super();

        this._defaultSettings = {
            namespace: 'custom-select',
        };

        this._settings = Tools.mapOptions(this._defaultSettings, options);

        this.el = el;
        this.el.classList.add(this.getNamespace('-original'));
        this.el.classList.add('custom-select-original');

        this.customSelect = document.createElement('dl');
        this.customSelect.classList.add(this.getNamespace());

        this.current = document.createElement('dt');
        this.current.classList.add(this.getNamespace('__label'));

        this.customOptions = document.createElement('dd');
        this.customOptions.classList.add(this.getNamespace('__options'));

        this.customSelect.appendChild(this.current);
        this.customSelect.appendChild(this.customOptions);

        this.selectOptions = this._createOptionsObjectFromElements(Array.from(el.children));
        this.customSelect.setAttribute('tabindex', this.el.tabIndex);

        if (this.el.nextElementSibling) {
            this.el.parentNode.insertBefore(this.customSelect, this.el.nextElementSibling);
        } else {
            this.el.parentNode.appendChild(this.customSelect);
        }

        // Focus on custom selection if focus is set on main select.
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

            this.current.innerHTML = this._getCurrentOptionElement().innerHTML;

            // Dispatch event for other listeners on select item itself.
            this.el.dispatchEvent(new Event('change', {
                bubbles: true,
            }));
        });

        this.render();

        this.select();
    }

    /**
     * Render current select options.
     */
    render() {
        let html = this._getSelectOptionMarkupFromObject(this.selectOptions);
        let menuHtml = this._getMenuOptionsMarkupFromObject(this.selectOptions);

        this.el.innerHTML = html;

        this.customOptions.innerHTML = menuHtml;
    }

    /**
     * Get the current selected option node.
     * @returns {*}
     * @private
     */
    _getCurrentOptionElement() {
        return this._value ? this.el.querySelector(`[value="${this._value}"]`) : this.el.querySelector('[selected]');
    }

    /**
     * Get selection option markup fron object.
     * @param options
     * @returns {string}
     * @private
     */
    _getSelectOptionMarkupFromObject(options) {
        let html = options.reduce((prev, current) => {
            let optionHtml;
            let attributes = current.attributes ? this._getAttributeString(current.attributes) : '';

            if (typeof current.inner === 'string') {
                optionHtml = `<option ${attributes}>${current.inner}</option>`;
            } else {
                optionHtml = `
                            <optgroup ${attributes} label="${current.inner.label}">
                                ${this._getSelectOptionMarkupFromObject(current.inner.items)}
                            </optgroup>`;
            }

            return prev + optionHtml;
        }, '');

        return html;
    }

    /**
     * Get menu items markup.
     * @param options
     * @returns {*}
     * @private
     */
    _getMenuOptionsMarkupFromObject(options) {
        let html = options.reduce((prev, current) => {
            let menuHTML;
            let attributes = current.attributes ? this._getAttributeString(current.attributes, 'data-') : '';

            if (typeof current.inner === 'string') {
                menuHTML = `<li ${attributes} class="${this.getNamespace('__option')}" tabindex="1">
                                ${current.inner}
                            </li>`;
            } else {
                menuHTML = `<li class="${this.getNamespace('__group')}">
                                <span>${current.inner.label}</span>
                                ${this._getMenuOptionsMarkupFromObject(current.inner.items)}
                            </li>`;
            }

            return prev + menuHTML;
        }, '');

        return `<ul class="${this.getNamespace('__options-inner')}">${html}</ul>`;
    }

    /**
     * Get attributes as string.
     * @param attributes
     * @returns {string}
     * @private
     */
    _getAttributeString(attributes, prefix = '') {
        return Object.keys(attributes)
            .reduce((prev, key) => ` ${prev} ${prefix}${key}="${attributes[key]}"`, '')
            .trim();
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
     * Set options of select and update custo select.
     * @param options
     */
    setOptions(options) {
        this.selectOptions = options;

        this.render();
    }

    /**
     * Get current value.
     * @returns {*}
     */
    getCurrentValue() {
        return this._value;
    }

    /**
     * Get name of current select field.
     * @returns {*}
     */
    getName() {
        return this.el.name || this.el.id;
    }

    /**
     * Create initial options object from children.
     *
     * @param children
     * @returns {*}
     * @private
     */
    _createOptionsObjectFromElements(children) {
        let obj = children.map((el) => this._createOptionsObjectFromSingleElement(el));

        return obj;
    }

    /**
     * Create single item options object.
     * @param el
     * @returns {{attributes: {}, inner: (String|Array)}}
     * @private
     */
    _createOptionsObjectFromSingleElement(el) {
        let inner;

        if (el.children.length) {
            inner = {
                label: el.label,
                items: this._createOptionsObjectFromElements(Array.from(el.children)),
            };
        } else {
            inner = el.innerHTML;
        }

        let obj = {
            inner,
            attributes: el.getAttributeNames().reduce((prev, attr) => {
                prev[attr] = el[attr];

                return prev;
            }, {}),
        };

        return obj;
    }
}

export default CustomSelect;
