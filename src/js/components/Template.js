/**
 * Handle template creation.
 */
class Template {
    /**
     * Construct.
     * @param template
     */
    constructor(template) {
        this.template = template.content.cloneNode(true);

        this.insertNodes = this.getTemplateInsertNodes();
    }

    /**
     * Get nodes for insert content from current template.
     * @returns {*}
     */
    getTemplateInsertNodes() {
        let elements = Array.from(this.template.querySelectorAll('[data-template]'));

        let obj = elements.reduce((prev, current) => {
            if (!prev[current.dataset.template]) {
                prev[current.dataset.template] = [];
            }

            prev[current.dataset.template].push(current);

            return prev;
        }, {});

        return obj;
    }

    /**
     * Create single item witch supplied data.
     * @param data
     * @returns {HTMLDivElement}
     */
    create(data) {
        for (let key of Object.keys(this.insertNodes)) {
            for (let el of this.insertNodes[key]) {
                if (data[key]) {
                    this._applyDataToElement(el, data[key]);
                } else {
                    el.remove();
                }
            }
        }

        return this.template.cloneNode(true);
    }

    /**
     * Apply data to element.
     * @param el
     * @param data
     * @private
     */
    _applyDataToElement(el, data) {
        switch (el.tagName.toLowerCase()) {
            case 'img':
                this._applyImageAttributes(el, data);
                break;
            default:
                el.innerHTML = data;
        }
    }

    /**
     * Apply data to image.
     * @param el
     * @param data
     * @private
     */
    _applyImageAttributes(el, data) {
        el.src = data.image_path;
        el.alt = data.title;
    }
}

export default Template;
