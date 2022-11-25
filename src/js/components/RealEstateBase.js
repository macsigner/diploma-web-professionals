import { GraphQLClient } from 'graphql-request';
import Base from './Base.js';
import SETTINGS from '../settings.js';

/**
 * Real estate base class.
 */
class RealEstateBase extends Base {
    /**
     * Construct.
     */
    constructor() {
        super();

        this._client = new GraphQLClient(SETTINGS.gqlURL);
    }

    /**
     * Get formatted object data.
     *
     * @param {Object} obj single estate object
     * @returns {Object} Object with additional formatted data
     * @private
     */
    _getFormattedObject(obj) {
        if (obj.prize) {
            obj['prize_local'] = obj.prize.toLocaleString('de-CH', {
                useGrouping: true,
            });
        }

        if (obj.images) {
            obj.image = obj.images[0];
        }

        if (obj.id) {
            obj.link = `./detail.html?estate=${obj.id}`;
        }

        return obj;
    }
}

export default RealEstateBase;
