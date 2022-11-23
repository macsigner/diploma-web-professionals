import GoogleMap from '../components/GoogleMap.js';

const nlMaps = document.querySelectorAll('[data-map]');

nlMaps.forEach(el => {
    let options = el.querySelector('script[type="application/json"]');

    console.log(options);

    if (options) {
        options = JSON.parse(options.innerHTML);

        new GoogleMap(el, options);
    } else {
        new GoogleMap(el);
    }
});

window.initMap = () => {
    window.dispatchEvent(new Event('mapsReady'));
};

let script = document.createElement('script');
// eslint-disable-next-line
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBuYN6-VdQmu93Y4GOaNomzqJyxYE-PM4U&callback=initMap&v=weekly';
script.defer = true;

document.head.appendChild(script);
