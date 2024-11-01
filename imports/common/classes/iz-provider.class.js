/*
 * /imports/common/classes/iz-provider.class.js
 *
 * A base class for the feature providers.
 * 
 * Each provider:
 * - is identified both with a machine identifier and a human readable string, through IIdent interface
 * - should advertise of its features, through the IFeatured interface
 * - may require some features provided by another provider
 * - should advertise of its claims and scopes.
 * 
 * All providers are registered in common/providers as a 'Providers' pseudo-collection.
 * 
 * Each organization should define the providers they wants use, or they want their clients may choose from.
 * Each provider is so selectable by the organization, which defaults to true.
 * 
 * Each client can choose, between providers selected at the organization level, which providers it wants use.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import mix from '@vestergaard-company/js-mixin';

import { IFeatured } from '/imports/common/interfaces/ifeatured.iface.js';
import { IIdent } from '/imports/common/interfaces/iident.iface.js';
import { IRequires } from '/imports/common/interfaces/irequires.iface.js';
import { ISelectable } from '/imports/common/interfaces/iselectable.iface.js';

import { izObject } from './iz-object.class.js';

export class izProvider extends mix( izObject ).with( IFeatured, IIdent, IRequires, ISelectable ){

    // static data

    // static methods

    // private data

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
     * @returns {Boolean} whether this provider is mandatory
     */
    isMandatory(){
        return false;
    }
}
