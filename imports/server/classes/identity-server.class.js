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

import { AccountsHub } from 'meteor/pwix:accounts-hub';
import { AccountsManager } from 'meteor/pwix:accounts-manager';

import { izObject } from '/imports/common/classes/iz-object.class.js';

import { Identities } from '/imports/common/collections/identities/index.js';

import { RequestServer } from '/imports/server/classes/request-server.class.js';

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
     * 
     * When a user first connects, this function is first called with an undefined token from GET /auth route
     * And then called again from POST /token with an AuthorizationCode token as
     *     '3': AuthorizationCode {
     *       iat: 1729330460,
     *       exp: 1729331060,
     *       accountId: 'test@test.te',
     *       acr: 'urn:iziam:password:0',
     *       authTime: 1729330460,
     *       codeChallenge: 'ExqfiztGHg2EsVtY8hOm_gs1Yck1JJIM5WsXOrMZiiE',
     *       codeChallengeMethod: 'S256',
     *       grantId: 'KVpqOSWffcHtbrE4DMVt5qA03yP7oDwsSC0B6_YL4q0',
     *       redirectUri: 'http://localhost:3000/_oauth/iziam',
     *       scope: 'openid',
     *       sessionUid: 'FGfi5Hr7Uk1vrc1H9EhzZ',
     *       clientId: '6eb26be8c55b44f48f2d046232e8cfac',
     *       expiresWithSession: true,
     *       kind: 'AuthorizationCode',
     *       jti: 'Gz4JyGqOEQdRUIYRJGNnMU_d6iwWro14oBHPGe1CrIj'
     *     }
     * 
     * Please note that we identify our identities on their '_id' identifier which doesn't depend of the connected client.
     * This is a design choice to identify the ResourceOwner rather than the usage he/she chooses to make of his/her permissions.
     */
    async findAccount( organization, ctx, id, token ){
        const identity = await Identities.s.findById( organization, id );
        // seems that oidc-provider doesn't accept another subject that the provided id
        const subject = id;
        //const subject = identity ? this.subject( identity ) : null;
        console.debug( 'subject', subject );
        return identity ? {
            accountId: subject,
            async claims( use, scope, claims, rejected ){
                return await Identities.claims.oidcRequest( organization, identity, subject, use, scope, claims, rejected );
            },
        } : null;
    }

    /**
     * @param {String} login
     * @return {Object} the found identity
     *  https://github.com/panva/node-oidc-provider/blob/v7.14.3/docs/README.md#accounts
     *  This is only used from the interaction '/interaction/:uid/login' route
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

    /**
     * @summary Materialize our design decision to identify identities with their internal '_id'
     * @return {String} the 'subject' of the tokens
     */
    subject( identity ){
        return identity._id;
    }
}
