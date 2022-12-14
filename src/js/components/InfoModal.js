import Modal from './Modal.js';

/**
 * Alert message
 */
class InfoModal extends Modal {
    /**
     * Construct.
     *
     * @param {Object} content Preset content options
     * @param {Object} options {@link Modal}
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

        let modalObject = super(infoModalElement, Object.assign({
            namespace: 'info-modal',
            lockScroll: false,
        }, options));

        options.appendTo.classList.add(this.getNamespace('-wrapper'));

        modalObject.modal.addEventListener('animationend', () => {
            if (!this.modal.matches('.open')) {
                options.appendTo.classList.remove(this.getNamespace('-wrapper'));
            }
        });
    }
}

export default InfoModal;
