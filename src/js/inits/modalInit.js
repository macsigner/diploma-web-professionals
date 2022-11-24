import * as Tools from '../tools.js';
import Modal from '../components/Modal.js';

document.addEventListener('click', Tools.delegate('[data-modal]', (e) => {
    e.preventDefault(e);

    let link = e.target.closest('[href],[data-modal]');

    new Modal(link.href ? link.hash : link.dataset.modal);
}));
