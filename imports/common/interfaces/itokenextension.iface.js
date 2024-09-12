/*
 * /imports/common/interfaces/itokenextension.iface.js
 *
 * Let a provider define the token extensions it is able to manage.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import { DeclareMixin } from '@vestergaard-company/js-mixin';

export const ITokenExtension = DeclareMixin(( superclass ) => class extends superclass {

    #priv = null;

    /**
     * @param {Object} o an object with following keys:
     *  - itokenextension: an array of the managed token extensions
     * @returns {ITokenExtension}
     */
    constructor( o ){
        super( ...arguments );

        if( o && o.itokenextension ){
            this.#priv = {
                tokenextension: o.itokenextension
            };
        }

        return this;
    }

    /**
     * @returns {Array<String>} the list of the managed token extensions
     */
    token_extensions(){
        return this.#priv?.tokenextension || [];
    }
});
