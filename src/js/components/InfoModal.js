import Modal from './Modal.js';

/**
 * Alert message
 */
class InfoModal extends Modal {
    /**
     * Construct.
     *
     * @param content {Object}
     * @param options
     */
    constructor(content, options = {
        appendTo: document.body,
    }) {
        let infoModalElement = document.createElement('div');
        infoModalElement.innerHTML = `
            <h1 class="info-modal__title">${content.title}</h1>
            <div class="info-modal__message">${content.message}</div>`;

        if (content.custom) {
            infoModalElement.appendChild(content.custom);
        }

        super(infoModalElement, Object.assign({
            namespace: 'info-modal',
            lockScroll: false,
        }, options));

        options.appendTo.classList.add(this.getNamespace('-wrapper'));
    }

    /**
     * Close infoModal.
     */
    close() {
        super.close();

        this._settings.appendTo.classList.remove(this.getNamespace('-wrapper'));
    }
}

export default InfoModal;
