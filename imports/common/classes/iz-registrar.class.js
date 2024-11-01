/*
 * /imports/common/classes/iz-registrar.class.js
 *
 * A base class for registrars.
 * 
 * The organizations are managed by the TenantsManager. All other registrars are managed here.
 * A new registrar is instanciated for each class per organization, e.g. there is a ClientsRegistrar for organization A, and another for organization B.
 * The list of ClientsRegistrar's is maintained by the ClientsRegistrar class itself as a static registry variable.
 * 
 * A registrar is a class which maintains a dynamic registry of all its objects.
 * it implements the IRegistrar interface.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import mix from '@vestergaard-company/js-mixin';

import { IRegistrar } from '/imports/common/interfaces/iregistrar.iface.js';

import { izObject } from './iz-object.class.js';

export class izRegistrar extends mix( izObject ).with( IRegistrar ){

    // static data

    // static methods

    // private data

    // private methods

    // public data

    /**
     * Constructor
     * @returns {izRegistrar}
     */
    constructor(){
        super( ...arguments );
        return this;
    }
}
