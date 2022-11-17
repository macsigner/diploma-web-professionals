import RealEstateDetailPage from '../components/RealEstateDetailPage.js';
import Template from '../components/Template.js';

let params = new URLSearchParams(window.location.search);

if (params.get('estate')) {
    let elTemplate = document.querySelector('template');

    let template = new Template(elTemplate);

    new RealEstateDetailPage(parseInt(params.get('estate')), {
        template,
    });
}
