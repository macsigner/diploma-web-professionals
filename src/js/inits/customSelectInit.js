import CustomSelect from '../components/CustomSelect.js';

const nlCustomSelects = document.querySelectorAll('[data-custom-select]');

nlCustomSelects.forEach(el => new CustomSelect(el));
