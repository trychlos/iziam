/*
 * /imports/server/classes/resource-server.class.js
 *
 * A class which provides Resource Server features.
 * 
 * A ResourceServer is instanciated once for each organization.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import mix from '@vestergaard-company/js-mixin';

import { izObject } from '/imports/common/classes/iz-object.class.js';

import { IRequested } from '/imports/server/interfaces/irequested.iface.js';

export class ResourceServer extends mix( izObject ).with( IRequested ){

    // static data

    // static methods

    // private data

    // private methods

    // public data

    /**
     * Constructor
     * @param {RequestServer} server the parent RequestServer instance
     * @returns {ResourceServer}
     */
    constructor( server ){
        super( ...arguments );
        console.debug( 'instanciating', server.organization().record.baseUrl, this );
        return this;
    }

    /**
     * @summary Make sure the server is initialized
     */
    async init(){
        console.debug( 'initializing', this.iRequestServer().organization().record.baseUrl, this );
    }
}
