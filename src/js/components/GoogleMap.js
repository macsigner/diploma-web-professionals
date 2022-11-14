/* globals google */
// eslint-disable-next-line
// Todo: extend documentation and finish :)
import Base from './Base.js';
import * as Tools from '../tools.js';

/**
 * Init google map.
 */
class GoogleMap extends Base {
    /**
     * Construct.
     * @param el
     * @param options
     */
    constructor(el, options = {}) {
        super();

        this.el = el;
        this._defaultSettings = {
            lat: 47.4236282,
            long: 9.2929987,
        };
        this._customSettings = options;
        this._settings = Tools.mapOptions(this._defaultSettings, this._customSettings);

        if (window.google) {
            this._init();
        } else {
            window.addEventListener('mapsReady', () => this._init());
        }
    }

    /**
     * Init map.
     * @private
     */
    _init() {
        this.geocoder = new google.maps.Geocoder();

        this.map = this._createMap();

        this.showAddress('Marktplatz Bohl, 9000 St.Gallen');
    }

    /**
     * Show specified address in map.
     * @param address
     */
    showAddress(address) {
        this.geocoder.geocode({
            address,
        }, (result, status) => {
            console.log(result, status);
        });
    }

    /**
     * Create map
     * @returns {*}
     * @private
     */
    _createMap() {
        console.log('create');

        return new google.maps.Map(this.el, {
            center: {
                lat: this._settings.lat,
                lng: this._settings.long,
            },
            zoom: 12,
        });
    }
}

export default GoogleMap;
