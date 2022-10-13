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
            prev[current.dataset.template] = current;

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
        for (let key in Object.keys(this.insertNodes)) {
            console.log(key);
            for (let el in this.insertNodes[key]) {
                console.log(el);
                if (data[key]) {
                    el.innerHTML = data[key];
                } else if (!el.innerHTML) {
                    el.remove();
                }
            }
        }

        return this.template.cloneNode(true);
    }
}

export default Template;
