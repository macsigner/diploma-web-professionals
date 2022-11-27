import RealEstateDetailPage from '../components/RealEstateDetailPage.js';

let params = new URLSearchParams(window.location.search);

if (params.get('estate')) {
    let el = document.querySelector('[data-real-estate-detail]');
    new RealEstateDetailPage(el, {
        id: parseInt(params.get('estate')),
    });
}
