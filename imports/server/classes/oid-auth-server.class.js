/*
 * /imports/server/classes/oid-auth-server.class.js
 *
 * An Authorization Server for OpenID.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x
import Provider from 'oidc-provider';

import { AuthServer } from '/imports/server/classes/auth-server.class.js';

export class OIDAuthServer extends AuthServer {

    // static data

    // static methods

    // private data

    // private methods

    // public data

    /**
     * Constructor
     * @returns {OIDAuthServer}
     */
    constructor(){
        super( ...arguments );
        return this;
    }
}
