/*
 * /imports/server/classes/identity-server.class.js
 *
 * A class which provides Identity Server features.
 * 
 * An IdentityServer is instanciated once for each organization.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x
import mix from '@vestergaard-company/js-mixin';

import { izObject } from '/imports/common/classes/iz-object.class.js';

import { IRequested } from '/imports/server/interfaces/irequested.iface.js';

export class IdentityServer extends mix( izObject ).with( IRequested ){

    // static data

    // static methods

    // private data

    // private methods

    // public data

    /**
     * Constructor
     * @param {RequestServer} server the parent RequestServer instance
     * @returns {IdentityServer}
     */
    constructor( server ){
        super( ...arguments );
        console.debug( 'instanciating IdentityServer' );
        return this;
    }

    /**
     * @param {Object} ctx
     * @param {String} id
     * @return {Object} the found identity
     *  https://github.com/panva/node-oidc-provider/blob/v7.14.3/docs/README.md#accounts
     */
    async findAccount( ctx, id ){
        console.debug( 'findAccount', arguments );
        return {
            accountId: id,
            async claims(use, scope) { return { sub: id }; },
        };
    }

    /**
     * @param {String} login
     * @return {Object} the found identity
     *  https://github.com/panva/node-oidc-provider/blob/v7.14.3/docs/README.md#accounts
     */
    async findByLogin( login ){
        console.debug( 'findByLogin', arguments );
        return {
            login: login
        };
    }

    /**
     * @summary Make sure the server is initialized
     */
    async init(){
        console.debug( 'initializing', this );
    }
}
