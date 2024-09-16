/*
 * /imports/server/classes/resource-server.class.js
 *
 * A class which provides Resource Server features.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { RequestServer } from '/imports/server/classes/request-server.class.js';

export class ResourceServer {

    // static data

    // static methods

    // private data

    #handleServer = null;

    // private methods

    // public data

    /**
     * Constructor
     * @param {RequestServer} server the parent RequestServer instance
     * @returns {ResourceServer}
     */
    constructor( server ){
        assert( server && server instanceof RequestServer, 'expects a RequestServer instance, got '+server );
        this.#handleServer = server;
        return this;
    }
}
