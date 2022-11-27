/**
 * Handle template creation.
 */
class Template {
    /**
     * Construct.
     *
     * @param {HTMLElement} template Template element
     */
    constructor(template) {
        this.templateParent = template.parentNode;
        this.template = template.content.cloneNode(true);

        this.insertNodes = this.getTemplateInsertNodes();

        this.template.querySelectorAll('[data-template]').forEach(el => el.removeAttribute('data-template'));
    }

    /**
     * Get nodes for insert content from current template.
     *
     * @returns {Object}
     */
    getTemplateInsertNodes() {
        let elements = Array.from(this.template.querySelectorAll('[data-template]'));

        let obj = elements.reduce((prev, current) => {
            if (!prev[current.dataset.template]) {
                prev[current.dataset.template] = [];
            }

            if (current.tagName.toLowerCase() === 'template') {
                prev[current.dataset.template].push(new Template(current));
            } else {
                prev[current.dataset.template].push(current);
            }

            return prev;
        }, {});

        return obj;
    }

    /**
     * Create single item witch supplied data.
     *
     * @param {Object} data
     * @returns {DocumentFragment} New document fragment with set data
     */
    create(data) {
        if (data) {
            for (let key of Object.keys(this.insertNodes)) {
                for (let el of this.insertNodes[key]) {
                    if (data[key] && Array.isArray(data[key]) && el instanceof Template) {
                        el.templateParent.innerHTML = '';

                        let subData = {};
                        for (let subItem of data[key]) {
                            subData[key] = subItem;
                            let subElement = el.create(subData);

                            el.templateParent.appendChild(subElement);
                        }
                    } else if (data[key]) {
                        this._applyDataToElement(el, data[key]);
                    }
                }
            }
        }

        return this.template.cloneNode(true);
    }

    /**
     * Apply data to element.
     *
     * @param {HTMLElement} el
     * @param {Object} data Object with template data
     * @private
     */
    _applyDataToElement(el, data) {
        switch (el.tagName.toLowerCase()) {
            case 'img':
                this._applyImageAttributes(el, data);
                break;
            case 'a':
                el.href = data;
                break;
            case 'input':
                el.value = data;
                break;
            default:
                el.innerHTML = data;
        }
    }

    /**
     * Apply data to image.
     *
     * @param {HTMLImageElement} el
     * @param {Object} data Data for image element
     * @private
     */
    _applyImageAttributes(el, data) {
        el.src = data.image_path;
        el.alt = data.title;
    }
}

export default Template;
