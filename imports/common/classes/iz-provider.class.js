/*
 * /imports/common/classes/iz-provider.class.js
 *
 * A base class for the providers.
 * 
 * Each provider:
 * - is identified both with a machine identifier and a human readable string, through IIdent interface
 * - defaults to not be selected
 * - should advertize of its features
 * - should advertize of its claims and scopes
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import mix from '@vestergaard-company/js-mixin';

import { IFeatured } from '/imports/common/interfaces/ifeatured.iface.js';
import { IIdent } from '/imports/common/interfaces/iident.iface.js';

import { izObject } from './iz-object.class.js';

export class izProvider extends mix( izObject ).with( IIdent ){

    // static data

    // static methods

    // private data

    // whether the provider defaults to be selected
    #selected = false;

    // private methods

    // protected data

    // public data

    /**
     * Constructor
     * @returns {izProvider}
     */
    constructor(){
        super( ...arguments );
        return this;
    }

    /**
     * Getter/Setter
     * @param {Boolean} whether this provider should be selected by default
     * @returns {Boolean} whether this provider is selected by default
     */
    selected( selected ){
        if( selected === true || selected === false ){
            this.#selected = selected
        }
        return this.#selected;
    }
}
