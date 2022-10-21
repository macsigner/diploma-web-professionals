import Template from './Template.js';

/**
 * Slider.
 */
class Slider {
    /**
     * Construct.
     * @param el
     * @param options
     */
    constructor(el, options = {
        addArrows: true,
        prevArrowContent: '<span className="invisible">vorheriger Slide</span>',
        nextArrowContent: '<span class="invisible">nächster Slide</span>',
        addPreview: true,
    }) {
        this.el = el;
        this.el.classList.add('slider__inner');
        this.slides = Array.from(el.children);
        this._settings = options;
        this._wrapper = document.createElement('div');
        this._wrapper.classList.add('slider');
        this.el.parentNode.insertBefore(this._wrapper, this.el);
        this._wrapper.appendChild(this.el);
        this.slides.forEach((el) => {
            el.classList.add('slider__item');
        });

        if (this._settings.addArrows) {
            this.prevArrow = document.createElement('button');
            this.prevArrow.innerHTML = this._settings.prevArrowContent;
            this.prevArrow.addEventListener('click', () => this.prev());

            this.nextArrow = document.createElement('button');
            this.nextArrow.innerHTML = this._settings.nextArrowContent;
            this.nextArrow.addEventListener('click', () => this.next());

            this._wrapper.appendChild(this.prevArrow);
            this._wrapper.appendChild(this.nextArrow);

            this.el.addEventListener('afterGoTo', () => this._updateArrows());
        }

        if (this._settings.addPreview) {
            let previewContainer = document.createElement('ul');
            previewContainer.classList.add('slider__preview');

            this._wrapper.appendChild(previewContainer);

            let htmlTemplate = document.createElement('template');
            htmlTemplate.dataset.templateName = 'preview';
            htmlTemplate.innerHTML = '<li class="slider__preview-item" data-index><img data-template="image"></li>';
            let template = new Template(htmlTemplate);

            this.slides.forEach((el, i) => {
                let img = el.querySelector('img');

                let preview = template.create({
                    image: {
                        title: img.alt ? img.alt : `Preview ${i}`,
                        'image_path': img.src,
                    },
                });

                previewContainer.appendChild(preview);
            });

            this.previewImages = Array.from(previewContainer.children);
            this.previewImages.forEach((el, i) => el.dataset.index = i);

            this.el.addEventListener('afterGoTo', (e) => this._updatePreviews(e));
        }

        this.goToSlide(0);
    }

    /**
     * Go to specified slide.
     * @param index
     */
    goToSlide(index) {
        this.index = index;

        this.slides.forEach((slide, i) => {
            // eslint-disable-next-line no-unused-expressions
            i === index ? slide.classList.add('current') : slide.classList.remove('current');
        });

        this.el.dispatchEvent(new Event('afterGoTo'));
    }

    /**
     * Go to previous slide.
     */
    prev() {
        this.goToSlide(Math.max(0, this.index - 1));
    }

    /**
     * Go to next slide.
     */
    next() {
        this.goToSlide(Math.min(this.slides.length - 1, this.index + 1));
    }

    /**
     * Update arrows visibility.
     * @private
     */
    _updateArrows() {
        switch (this.index) {
            case this.slides.length - 1:
                this.prevArrow.removeAttribute('disabled');
                this.nextArrow.disabled = true;
                break;
            case 0:
                this.prevArrow.disabled = true;
                this.nextArrow.removeAttribute('disabled');
                break;
            default:
                this.prevArrow.removeAttribute('disabled');
                this.nextArrow.removeAttribute('disabled');
        }
    }

    /**
     * Update preview image classes.
     * @private
     */
    _updatePreviews() {
        this.previewImages.forEach(el => {
            if (Number(el.dataset.index) === this.index) {
                el.classList.add('current');
            } else {
                el.classList.remove('current');
            }
        });
    }
}

export default Slider;
