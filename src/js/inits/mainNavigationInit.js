import MainNavigation from '../components/MainNavigation.js';

const el = document.querySelector('#nav-bar');

if (el) {
    new MainNavigation(el);
}
