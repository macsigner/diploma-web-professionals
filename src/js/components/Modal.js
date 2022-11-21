import * as Tools from '../tools.js';
import Base from './Base.js';

/**
 * Default modal for contact page.
 */
class Modal extends Base {
    /**
     * Construct.
     * @param content
     * @param options
     */
    constructor(content, options = {}) {
        super();

        this._defaultSettings = {
            namespace: 'modal',
            appendTo: document.body,
            closeButtonContent: 'schliessen',
        };
        this._customSettings = options;
        this._settings = Tools.mapOptions(this._defaultSettings, this._customSettings);

        if (typeof content === 'string') {
            content = document.querySelector(content).cloneNode(true);

            this._cleanContentAttributes(content);
        }

        this.modal = this._createModal(content);

        this.modal.addEventListener('click', Tools.delegate('[data-modal-close]', this.close.bind(this)));

        this._settings.appendTo.appendChild(this.modal);

        document.documentElement.style.setProperty('overflow', 'hidden');
    }

    /**
     * Close current modal.
     */
    close() {
        this.modal.remove();

        document.documentElement.style.removeProperty('overflow');
    }

    /**
     * Clean content attributes from unique or unused values.
     * @param content
     * @private
     */
    _cleanContentAttributes(content) {
        let wrapper = content.closest('[id]');
        wrapper.removeAttribute('id');

        content.querySelectorAll('[id]').forEach(el => {
            el.removeAttribute('id');
        });
    }

    /**
     * Create basic modal.
     * @private
     */
    _createModal(content) {
        let modal = document.createElement('div');
        modal.classList.add(this.getNamespace());

        let modalInner = document.createElement('div');
        modalInner.classList.add(this.getNamespace('__inner'));
        modalInner.innerHTML
            = `<button class="${this.getNamespace('__close')}" data-modal-close>
                    ${this._settings.closeButtonContent}
               </button>`;
        modalInner.appendChild(content);

        modal.appendChild(modalInner);

        return modal;
    }
}

export default Modal;