/*
 * /imports/common/interfaces/iclienttype.iface.js
 *
 * Let a provider Define the client types it is able to manage.
 * 
 * The application defines as ClientType definition all known client types.
 * Each provider may define its own managed client types among the known ClientType definition.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import { DeclareMixin } from '@vestergaard-company/js-mixin';

export const IClientType = DeclareMixin(( superclass ) => class extends superclass {

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

    /**
     * @returns {Array<String>} the list of the required features
     */
    requires(){
        return this.#priv?.requires || [];
    }
});
