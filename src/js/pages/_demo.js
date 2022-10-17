import Modal from '../components/Modal.js';

let generatedContentInput = document.querySelector('#modal-input-generated');

document.querySelector('#modal-button-generated').addEventListener('click', () => {
    let title = document.createElement('h1');

    title.innerHTML = generatedContentInput.value;

    new Modal(title);
});

import '../inits/initMap.js';

import '../inits/filterInit.js';

import '../inits/realEstatesInit.js';

import '../inits/customSelectInit.js';
