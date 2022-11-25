import Modal from './Modal.js';

/**
 * Alert message
 */
class Alert extends Modal {
    /**
     * Construct.
     *
     * @param content {Object}
     * @param options
     */
    constructor(content, options = {
        appendTo: document.body,
    }) {
        let alertElement = document.createElement('div');
        alertElement.innerHTML = `
            <h1 class="alert__title">${content.title}</h1>
            <div class="alert__message">${content.message}</div>`;

        if (content.custom) {
            alertElement.appendChild(content.custom);
        }

        super(alertElement, {
            namespace: 'alert',
            appendTo: options.appendTo,
            lockScroll: false,
        });

        options.appendTo.classList.add(this.getNamespace('-wrapper'));
    }

    /**
     * Close alert.
     */
    close() {
        super.close();

        this._settings.appendTo.classList.remove(this.getNamespace('-wrapper'));
    }
}

export default Alert;
