import MainNavigation from '../components/MainNavigation.js';

const el = document.querySelector('#navigation-area');

if (el) {
    new MainNavigation(el);
}
