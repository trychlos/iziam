/*
 * /imports/common/interfaces/irequires.iface.js
 *
 * Register IFeatured requirements.
 * 
 * A provider which implements IRequires may declare the IFeatured it requires, so that if none of the registered/selected providers implement such a IFeature, then this provider cannot be selected.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import { DeclareMixin } from '@vestergaard-company/js-mixin';

export const IRequires = DeclareMixin(( superclass ) => class extends superclass {

    #priv = null;

    /**
     * @param {Object} o an object with following keys:
     *  - irequires: an array of the exposed feature identifiers
     * @returns {IRequires}
     */
    constructor( o ){
        super( ...arguments );

        if( o && o.irequires ){
            this.#priv = {
                requires: o.irequires
            };
        }

        return this;
    }

    /**
     * @returns {Array<String>} the list of the required features
     */
    requires(){
        return this.#priv?.requires || [];
    }
});
