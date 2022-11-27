import Template from './Template.js';
import * as Tools from '../tools.js';

/**
 * Slider.
 */
class Slider {
    /**
     * Construct.
     * @param el
     * @param options
     */
    constructor(el, options = {}) {
        this.el = el;

        this._defaultSettings = {
            addArrows: true,
            prevArrowContent: `<span class="slider__prev-icon slider__arrow-icon"></span>
                                   <span class="invisible">vorheriger Slide</span>`,
            nextArrowContent: `<span class="invisible">nächster Slide</span>
                                   <span class="slider__next-icon slider__arrow-icon"></span>`,
            addPreview: true,
        };
        this._customSettings = options;
        this._settings = Tools.mapOptions(this._defaultSettings, this._customSettings);

        this.el.classList.add('slider__slides');
        this.slides = Array.from(el.children);

        this._sliderInner = document.createElement('div');
        this._sliderInner.classList.add('slider__inner');

        this._sliderWrapper = document.createElement('div');
        this._sliderWrapper.classList.add('slider');
        this._sliderWrapper.appendChild(this._sliderInner);

        this.el.parentNode.insertBefore(this._sliderWrapper, this.el);
        this._sliderInner.appendChild(this.el);

        this.slides.forEach((el) => {
            el.classList.add('slider__item');
        });

        if (this._settings.addArrows) {
            this._appendArrows();
        }

        if (this._settings.addPreview) {
            this._appendPreviews();

            this._sliderWrapper.addEventListener(
                'click',
                Tools.delegate('.slider__preview-item', (e) => this._previewClickListener(e))
            );
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
     * Append arrows to current slider.
     * @private
     */
    _appendArrows() {
        this.prevArrow = document.createElement('button');
        this.prevArrow.innerHTML = this._settings.prevArrowContent;
        this.prevArrow.addEventListener('click', () => this.prev());
        this.prevArrow.classList.add('slider__prev', 'slider__arrow');

        this.nextArrow = document.createElement('button');
        this.nextArrow.innerHTML = this._settings.nextArrowContent;
        this.nextArrow.addEventListener('click', () => this.next());
        this.nextArrow.classList.add('slider__next', 'slider__arrow');

        this._sliderInner.appendChild(this.prevArrow);
        this._sliderInner.appendChild(this.nextArrow);

        this.el.addEventListener('afterGoTo', () => this._updateArrows());
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
     * Append and create preview images to current slider.
     * @private
     */
    _appendPreviews() {
        let previewContainer = document.createElement('ul');
        previewContainer.classList.add('slider__preview');

        this._sliderWrapper.appendChild(previewContainer);

        let htmlTemplate = document.createElement('template');
        htmlTemplate.dataset.templateName = 'preview';
        htmlTemplate.innerHTML
            = '<li class="slider__preview-item" loading="lazy" data-index><img data-template="image"></li>';
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

    /**
     * Handle clicks on preview items.
     * @param e
     * @private
     */
    _previewClickListener(e) {
        let indexItem = e.target.closest('[data-index]');

        this.goToSlide(parseInt(indexItem.dataset.index));
    }
}

export default Slider;
