/*
 * /imports/server/classes/auth-server.class.js
 *
 * A class which provides Authorization Server features.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { RequestServer } from '/imports/server/classes/request-server.class.js';

export class AuthServer {

    // static data

    // static methods

    // private data

    #handleServer = null;

    // private methods

    // public data

    /**
     * Constructor
     * @param {RequestServer} server the parent RequestServer instance
     * @returns {AuthServer}
     */
    constructor( server ){
        assert( server && server instanceof RequestServer, 'expects a RequestServer instance, got '+server );
        this.#handleServer = server;
        return this;
    }
}
