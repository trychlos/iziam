/*
 * /imports/server/classes/app-server.class.js
 *
 * Manage the AppServer class.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { AppCommon } from '../../common/classes/app-common.class';

export class AppServer extends AppCommon {

    // static data

    // static methods

    // private data

    #priv = {
    };

    // private methods

    // public data

    /**
     * Constructor
     * Instanciated at initialization time.
     * @returns {AppServer}
     */
    constructor(){
        super( ...arguments );
        return this;
    }

    /**
     * Run the server application
     * @returns {AppServer}
     */
    run(){
        console.debug( 'AppServer::run()' );
        return this;
    }
}
