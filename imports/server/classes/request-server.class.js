/*
 * /imports/server/classes/request-server.class.js
 *
 * A class which gathers all servers for an organization.
 * 
 * It defines AuthServer, IdentityServer and ResourceServer server instances.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { IRequestable } from '/imports/common/interfaces/irequestable.iface.js';

import { AuthServer } from '/imports/server/classes/auth-server.class.js';
import { IdentityServer } from '/imports/server/classes/identity-server.class.js';
import { OIDAuthServer } from '/imports/server/classes/oid-auth-server.class.js';
import { ResourceServer } from '/imports/server/classes/resource-server.class.js';

export class RequestServer {

    // static data
    static classes = {
        AuthServer,
        IdentityServer,
        OIDAuthServer,
        ResourceServer
    };

    // static methods

    // private data

    // instanciation time
    #requestable = null;
    #organization = null;

    // runtime
    #authServer = null;
    #identityServer = null;
    #resourceServer = null;

    // private methods

    // public data

    /**
     * Constructor
     * @param {IRequestable} provider the IRequestable provider
     * @param {Object} organization an { entity, record } organization object
     * @param {Object} opts an optional options object with following keys:
     *  - auth: the AuthServer to instanciate
     *  - identity: the IdentityServer to instanciate
     *  - resource: the ResourceServer to instanciate
     * @returns {RequestServer}
     */
    constructor( provider, organization, opts={} ){
        assert( provider && provider instanceof IRequestable, 'expects a IRequestable instance, got '+provider );

        // keep instanciation arguments
        this.#requestable = provider;
        this.#organization = organization;

        // instanciates other servers
        this.#authServer = opts.auth ? new RequestServer.classes[opts.auth]( this ) : new AuthServer( this );
        this.#identityServer = opts.identity ? new RequestServer.classes[opts.identity]( this ) : new IdentityServer( this );
        this.#resourceServer = opts.resource ? new RequestServer.classes[opts.resource]( this ) : new ResourceServer( this );

        //console.debug( 'arguments', arguments );
        //console.debug( 'this', this );

        return this;
    }

    /**
     * @summary Handle a request
     * @param {String} url
     * @param {WebArgs} args
     */
    async handle( url, args ){
        args.answer({ ok: true });
        args.end();
    }

    /**
     * Getter
     * @returns {Object} the organization
     */
    organization(){
        return this.#organization;
    }
}
