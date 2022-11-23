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
            position: {
                lat: 47.4236282,
                lng: 9.2929987,
            },
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

        // eslint-disable-next-line
        let pinSVGHole = 'M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z';
        let markerImage = {
            path: pinSVGHole,
            anchor: new google.maps.Point(12, 17),
            fillOpacity: 1,
            fillColor: '000000',
            strokeWeight: 0,
            strokeColor: '000000',
            scale: 2,
            labelOrigin: new google.maps.Point(12, 15),
        };

        Object.keys(this._settings.marker).forEach(key => {
            let obj = this._settings.marker[key];

            new google.maps.Marker({
                position: obj.position,
                map: this.map,
                title: obj.title,
                icon: markerImage,
            });
        });
    }

    /**
     * Create map
     * @returns {*}
     * @private
     */
    _createMap() {
        return new google.maps.Map(this.el, {
            center: this._settings.position,
            styles: this._getMapStyle(),
            zoom: 16,
        });
    }

    /**
     * Map style from snazzy maps https://snazzymaps.com/style/132/light-gray
     * @returns {Array}
     * @private
     */
    _getMapStyle() {
        return [
            {
                'featureType': 'administrative',
                'stylers': [
                    {
                        'visibility': 'off',
                    },
                ],
            },
            {
                'featureType': 'landscape',
                'stylers': [
                    {
                        'visibility': 'simplified',
                    },
                ],
            },
            {
                'featureType': 'landscape',
                'elementType': 'geometry.fill',
                'stylers': [
                    {
                        'color': '#EFEFEF',
                    },
                    {
                        'visibility': 'on',
                    },
                ],
            },
            {
                'featureType': 'poi',
                'stylers': [
                    {
                        'visibility': 'off',
                    },
                ],
            },
            {
                'featureType': 'poi',
                'elementType': 'labels.icon',
                'stylers': [
                    {
                        'color': '#888888',
                    },
                    {
                        'visibility': 'on',
                    },
                ],
            },
            {
                'featureType': 'poi.business',
                'elementType': 'labels.icon',
                'stylers': [
                    {
                        'visibility': 'simplified',
                    },
                ],
            },
            {
                'featureType': 'poi.business',
                'elementType': 'labels.text',
                'stylers': [
                    {
                        'visibility': 'on',
                    },
                ],
            },
            {
                'featureType': 'poi.business',
                'elementType': 'labels.text.fill',
                'stylers': [
                    {
                        'color': '#4e4646',
                    },
                ],
            },
            {
                'featureType': 'poi.business',
                'elementType': 'labels.text.stroke',
                'stylers': [
                    {
                        'color': '#ffffff',
                    },
                    {
                        'visibility': 'off',
                    },
                ],
            },
            {
                'featureType': 'road',
                'elementType': 'labels.icon',
                'stylers': [
                    {
                        'visibility': 'off',
                    },
                ],
            },
            {
                'featureType': 'road',
                'elementType': 'labels.text.fill',
                'stylers': [
                    {
                        'color': '#696969',
                    },
                ],
            },
            {
                'featureType': 'road.arterial',
                'elementType': 'geometry.fill',
                'stylers': [
                    {
                        'color': '#FFFFFF',
                    },
                ],
            },
            {
                'featureType': 'road.arterial',
                'elementType': 'geometry.stroke',
                'stylers': [
                    {
                        'color': '#D6D6D6',
                    },
                ],
            },
            {
                'featureType': 'road.highway',
                'elementType': 'geometry.fill',
                'stylers': [
                    {
                        'color': '#FFFFFF',
                    },
                ],
            },
            {
                'featureType': 'road.highway',
                'elementType': 'geometry.stroke',
                'stylers': [
                    {
                        'color': '#B3B3B3',
                    },
                    {
                        'visibility': 'on',
                    },
                ],
            },
            {
                'featureType': 'road.local',
                'elementType': 'geometry.fill',
                'stylers': [
                    {
                        'color': '#FFFFFF',
                    },
                    {
                        'visibility': 'on',
                    },
                    {
                        'weight': 1.8,
                    },
                ],
            },
            {
                'featureType': 'road.local',
                'elementType': 'geometry.stroke',
                'stylers': [
                    {
                        'color': '#D7D7D7',
                    },
                ],
            },
            {
                'featureType': 'transit',
                'stylers': [
                    {
                        'color': '#808080',
                    },
                    {
                        'visibility': 'off',
                    },
                ],
            },
            {
                'featureType': 'water',
                'elementType': 'geometry.fill',
                'stylers': [
                    {
                        'color': '#D3D3D3',
                    },
                ],
            },
        ];
    }
}

export default GoogleMap;
