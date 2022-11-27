import RealEstateDetail from './RealEstateDetail.js';
import Template from './Template.js';

/**
 * Real estate detail page class.
 */
class RealEstateDetailPage {
    /**
     * Construct
     * @param id
     * @param options
     */
    constructor(el, options = {}) {
        this.el = el;
        let elTemplate = el.querySelector('template');

        this._settings = options;
        this._settings.template = new Template(elTemplate);

        this._detail = new RealEstateDetail(this.el, {
            template: this._settings.template,
        });

        let promise = this._detail.open(this._settings.id);

        promise.then(() => {
            let data = this._detail.getData();

            this._applyMetaData({
                description: data.description,
                title: `Home House - ${data.title}`,
            });
        });
    }

    /**
     * Apply meta data on current page.
     * @param obj
     * @private
     */
    _applyMetaData(obj) {
        if (obj.description) {
            let description = document.head.querySelector('meta[name="description"]') || document.createElement('meta');

            description.content = obj.description;

            document.head.appendChild(description);
        }

        if (obj.title) {
            let title = document.head.querySelector('title') || document.createElement('title');

            title.innerHTML = obj.title;

            document.head.appendChild(title);
        }
    }
}

export default RealEstateDetailPage;
