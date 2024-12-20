/*
 * /imports/server/classes/auth-server.class.js
 *
 * A class which provides Authorization Server features. This is also the base class for OIDAuthServer, the OpenID Connect Auth server.
 * 
 * An AuthServer is instanciated once for each organization.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import mix from '@vestergaard-company/js-mixin';

import { Clients } from '/imports/common/collections/clients/index.js';

import { izObject } from '/imports/common/classes/iz-object.class.js';

import { IRequested } from '/imports/server/interfaces/irequested.iface.js';

export class AuthServer extends mix( izObject ).with( IRequested ){

    // static data

    // static methods

    /**
     * @summary Find a connecting client
     * @param {String} clientId the client identifier
     * @returns {Object} a client suitable for use by openid auth server, or null
     *  Keep the payload intermediate key as this is the preferred format of the OIDMongoAdapter
     */
    static async byClientId( clientId ){
        const client = await Clients.s.byClientIdAtDate( clientId );
        //console.debug( 'client', client );
        let result = null;
        if( client && client.record.enabled ){
            result = {
                payload: await Clients.s.registeredMetadata( client )
            }
        }
        //console.debug( 'byClientId()', result );
        return result;
    }

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
        console.debug( 'instanciating', server.organization().record.baseUrl, this );
        return this;
    }

    /**
     * @summary Make sure the server is initialized
     */
    async init(){
    }
}
