/*
 * /imports/common/interfaces/ifeatured.iface.js
 *
 * Manage the features exposed by a provider.
 * The features must be passed as an object to the constructor.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import { DeclareMixin } from '@vestergaard-company/js-mixin';

export const IFeatured = DeclareMixin(( superclass ) => class extends superclass {

    #priv = null;

    /**
     * @param {Object} o an object with following keys:
     *  - ifeatured: an array of the exposed feature identifiers
     * @returns {IFeatured}
     */
    constructor( o ){
        super( ...arguments );

        if( o && o.ifeatured ){
            this.#priv = {
                features: o.ifeatured
            };
        }

        return this;
    }

    /**
     * @returns {Array<String>} the list of the exposed features
     */
    features(){
        return this.#priv?.features || [];
    }
});
