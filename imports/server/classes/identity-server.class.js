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
        console.debug( 'instanciating', server.organization().record.baseUrl, this );
        return this;
    }

    /**
     * @param {Object} ctx the koa request context
     * @param {String} id
     * @param {String} token a reference to the token used for which a given account is being loaded,
     *  it is undefined in scenarios where account claims are returned from authorization endpoint
     * @return {Object} the found identity
     *  https://github.com/panva/node-oidc-provider/blob/v7.14.3/docs/README.md#accounts
     *  https://github.com/panva/node-oidc-provider/blob/47a77d9afe90578ea4dfed554994b60b837a3059/example/support/account.js
     */
    async findAccount( ctx, id, token ){
        console.debug( 'findAccount', arguments );
        return {
            accountId: id,
            // @param use {string} - can either be "id_token" or "userinfo", depending on
            //   where the specific claims are intended to be put in
            // @param scope {string} - the intended scope, while oidc-provider will mask
            //   claims depending on the scope automatically you might want to skip
            //   loading some claims from external resources or through db projection etc. based on this
            //   detail or not return them in ID Tokens but only UserInfo and so on
            // @param claims {object} - the part of the claims authorization parameter for either
            //   "id_token" or "userinfo" (depends on the "use" param)
            // @param rejected {Array[String]} - claim names that were rejected by the end-user, you might
            //   want to skip loading some claims from external resources or through db projection
            async claims( use, scope, claims, rejected ){
                return {
                    sub: id
                };
            }
        };
    }

    /**
     * @param {String} login
     * @return {Object} the found identity
     *  https://github.com/panva/node-oidc-provider/blob/v7.14.3/docs/README.md#accounts
     *  This is only used from the interaction '/interaction/:uid:login' route
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
        console.debug( 'initializing', this.iRequestServer().organization().record.baseUrl, this );
    }
}
