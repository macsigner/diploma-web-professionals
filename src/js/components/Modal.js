import * as Tools from '../tools.js';

/**
 * Default modal for contact page.
 */
class Modal {
    /**
     * Construct.
     * @param content
     * @param options
     */
    constructor(content, options = {
        appendTo: document.body,
        closeButtonContent: 'schliessen',
    }) {
        this._settings = options;

        if (typeof content === 'string') {
            content = document.querySelector(content).cloneNode(true);

            this._cleanContentAttributes(content);
        }

        this.modal = this._createModal(content);

        this.modal.addEventListener('click', Tools.delegate('[data-modal-close]', this.close.bind(this)));

        this._settings.appendTo.appendChild(this.modal);
    }

    /**
     * Close current modal.
     */
    close() {
        this.modal.remove();
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
        modal.classList.add('modal');

        let modalInner = document.createElement('div');
        modalInner.classList.add('modal__inner');
        modalInner.innerHTML
            = `<button class="modal__close" data-modal-close>${this._settings.closeButtonContent}</button>`;
        modalInner.appendChild(content);

        modal.appendChild(modalInner);

        return modal;
    }
}

export default Modal;
