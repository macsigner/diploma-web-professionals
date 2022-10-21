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

        if (this._settings.addArrows) {
            this._updateArrows();
        }
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
}

export default Slider;
