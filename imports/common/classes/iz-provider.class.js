/*
 * /imports/common/classes/iz-provider.class.js
 *
 * A base class for the feature providers.
 * 
 * Each provider:
 * - is identified both with a machine identifier and a human readable string, through IIdent interface
 * - should advertize of its features, through the IFeatured interface
 * - should advertize of its claims and scopes
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import mix from '@vestergaard-company/js-mixin';

import { IFeatured } from '/imports/common/interfaces/ifeatured.iface.js';
import { IIdent } from '/imports/common/interfaces/iident.iface.js';
import { IRequires } from '/imports/common/interfaces/irequires.iface.js';

import { izObject } from './iz-object.class.js';

export class izProvider extends mix( izObject ).with( IFeatured, IIdent, IRequires ){

    // static data

    // static methods

    // private data

    // whether the provider defaults to be selected
    #defaultSelected = false;

    // whether the user can modify the selection
    #userSelectable = true;

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
     * @param {Boolean} selected whether this provider should be selected by default
     * @returns {Boolean} whether this provider is selected by default
     */
    defaultSelected( selected ){
        if( selected === true || selected === false ){
            this.#defaultSelected = selected
        }
        return this.#defaultSelected;
    }

    /**
     * Getter/Setter
     * @param {Boolean} selectable whether the allowded user can choose himself to select or not the provider
     * @returns {Boolean} the current selectability status
     */
    userSelectable( selectable ){
        if( selectable === true || selectable === false ){
            this.#userSelectable = selectable
        }
        return this.#userSelectable;
    }
}
