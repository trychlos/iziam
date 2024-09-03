/*
 * /imports/common/interfaces/igranttype.iface.js
 *
 * Let a provider define the authorization grant types it is able to manage.
 * 
 * The application defines as GrantType definition all known authorization grant types.
 * Each provider may define its own managed grant types among the known GrantType definition.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import { DeclareMixin } from '@vestergaard-company/js-mixin';

export const IGrantType = DeclareMixin(( superclass ) => class extends superclass {

    #priv = null;

    /**
     * @param {Object} o an object with following keys:
     *  - irequires: an array of the exposed feature identifiers
     * @returns {IRequires}
     */
    constructor( o ){
        super( ...arguments );

        if( o && o.igranttype ){
            this.#priv = {
                granttype: o.igranttype
            };
        }

        return this;
    }

    /**
     * @returns {Array<String>} the list of the managed grant types
     */
    grant_types(){
        return this.#priv?.granttype || [];
    }
});
