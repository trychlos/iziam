/*
 * /imports/server/classes/auth-server.class.js
 *
 * A class which provides Authorization Server features. This is also the base class for OIDAuthServer, the OpenID Connect Auth server.
 * 
 * An AuthServer is instanciated once for each organization.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x
import mix from '@vestergaard-company/js-mixin';

import { izObject } from '/imports/common/classes/iz-object.class.js';

import { IRequested } from '/imports/server/interfaces/irequested.iface.js';

export class AuthServer extends mix( izObject ).with( IRequested ){

    // static data

    // static methods

    // private data

    // private methods

    // public data

    /**
     * Constructor
     * @param {RequestServer} server the parent RequestServer instance
     * @returns {AuthServer}
     */
    constructor( server ){
        super( ...arguments );
        return this;
    }
}
