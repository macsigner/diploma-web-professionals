import Slider from '../components/Slider.js';

const nlSlider = document.querySelectorAll('[data-slider]');

nlSlider.forEach(el => new Slider(el));
