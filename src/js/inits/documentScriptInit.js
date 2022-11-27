import { debounce } from '../tools.js';

let navBar = document.querySelector('.nav-bar');
let resizeTimeout;
/**
 *
 */
function setResizeProperties() {
    document.documentElement.style.setProperty('--nav-bar-height', `${navBar.offsetHeight}px`);
    document.documentElement.classList.add('resizing');

    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => document.documentElement.classList.remove('resizing'), 100);
}

document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js');

window.addEventListener('scroll', debounce((e) => {
    window.dispatchEvent(new CustomEvent('delayedScroll', {
        detail: {
            originalEvent: e,
        },
    }));
}));

setResizeProperties();
window.addEventListener('resize', setResizeProperties);
