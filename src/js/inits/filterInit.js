import Filter from '../components/Filter.js';

const nlFilter = document.querySelectorAll('[data-filter]');

nlFilter.forEach(el => new Filter(el));
