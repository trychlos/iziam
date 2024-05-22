/*
 * /imports/client/classes/app-client.class.js
 *
 * Manage the AppClient class.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { AppCommon } from '../../common/classes/app-common.class';

export class AppClient extends AppCommon {

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
     * @returns {AppClient}
     */
    constructor(){
        super( ...arguments );
        return this;
    }

    /**
     * Run the client application
     * @returns {AppClient}
     */
    run(){
        console.debug( 'AppClient::run()' );
        return this;
    }
}
