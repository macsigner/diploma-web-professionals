/* globals google */

// Todo: extend documentation and finish :)
/**
 * Init google map.
 */
class GoogleMap {
    /**
     * Construct.
     * @param el
     * @param options
     */
    constructor(el) {
        this.el = el;

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
        return new google.maps.Map(this.el, {
            center: {
                lat: 47.4236282,
                lng: 9.2929987,
            },
            zoom: 12,
        });
    }
}

export default GoogleMap;
