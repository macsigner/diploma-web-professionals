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

let windowWidth = window.innerWidth;

window.addEventListener('resize', debounce(() => {
    if (windowWidth !== window.innerWidth) {
        windowWidth = window.innerWidth;

        window.dispatchEvent(new Event('widthResize'));
    }
}));

window.addEventListener('scroll', debounce(() => {
    if (window.scrollY > 100) {
        document.documentElement.classList.add('has-scrolled');
    } else {
        document.documentElement.classList.remove('has-scrolled');
    }
}));

setResizeProperties();
window.addEventListener('resize', setResizeProperties);
