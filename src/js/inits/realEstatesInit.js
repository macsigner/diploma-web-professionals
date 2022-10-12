import RealEstates from '../components/RealEstates.js';

const nlRealEstates = document.querySelectorAll('[data-real-estates]');

nlRealEstates.forEach(el => new RealEstates(el));
