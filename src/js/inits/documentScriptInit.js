import { debounce } from '../tools.js';

let navBar = document.querySelector('.nav-bar');

/**
 *
 */
function setCustomProperties() {
    document.documentElement.style.setProperty('--nav-bar-height', `${navBar.offsetHeight}px`);
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

setCustomProperties();
window.addEventListener('resize', setCustomProperties);
