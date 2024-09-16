/*
 * /imports/server/classes/oid-auth-server.class.js
 *
 * An Authorization Server for OpenID.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x
import Provider from 'oidc-provider';

import { Organizations } from '/imports/common/collections/organizations/index.js';

import { AuthServer } from '/imports/server/classes/auth-server.class.js';

export class OIDAuthServer extends AuthServer {

    // static data

    // static methods

    // private data

    #oidc = null;

    // private methods

    // returns a new OIDC Provider
    //  must have at least an issuer
    _instanciateOidc(){
        const requestServer = this.iRequestServer();
        const organization = requestServer.organization();
        const issuer = Organizations.fn.fullBaseUrl( organization );
        let setup = {};
        const oidc = new Provider( issuer, setup );
        return oidc;
    }

    // public data

    /**
     * Constructor
     * @param {RequestServer} server the parent RequestServer instance
     * @returns {OIDAuthServer}
     */
    constructor(){
        super( ...arguments );

        // we would wish have an OIDC Provider with the same time life as this AuthServer
        // but the former requires a configuration which can be changed over time
        this.#oidc = this._instanciateOidc();

        return this;
    }
}
