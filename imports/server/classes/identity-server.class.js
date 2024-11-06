/*
 * /imports/server/classes/identity-server.class.js
 *
 * A class which provides Identity Server features.
 * 
 * An IdentityServer is instanciated once for each organization.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import mix from '@vestergaard-company/js-mixin';

import { izObject } from '/imports/common/classes/iz-object.class.js';
import { izProvider } from '/imports/common/classes/iz-provider.class.js';

import { Authorizations } from '/imports/common/collections/authorizations/index.js';
import { Clients } from '/imports/common/collections/clients/index.js';
import { Identities } from '/imports/common/collections/identities/index.js';
import { Organizations } from '/imports/common/collections/organizations/index.js';

import { IIdentityAuth } from '/imports/common/interfaces/iidentity-auth.iface.js';

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
     * @summary Authenticate the identity
     * @param {Object} identity the found identity
     * @param {String} password the provided password
     * @param {Object} client an { entity, record } object
     * @returns {Object} with following keys:
     *  - authenticated: {Boolean} true if the identity is authenticated
     *      returns false (and emits a warning) if the organization didn't select any authentication provider
     *      returns true (and emits a warning) if the doesn't require authenticated identities
     *      returns true if the password is right
     *  - reason: if authenticated is false, the reason as:
     *      IDENTITY_AUTH_MODE_NONE
     *      IDENTITY_NO_PASSWORD
     *      IDENTITY_WRONG_PASSWORD
     *      NO_AUTHENTICATION_PROVIDER
     *      NO_WILLING_TO_PROVIDER
     *  - acr: if authenticated is true, the used Authentication Context class Reference (provided by the Authentication provider)
     *  - canContinue: whether the IdentityServer considers that the login process can continue:
     *      because the identity has been authenticated
     *      or because the client doesn't want authentication
     *      or because the organization didn't select any IIdentityAuth provider
     */
    async authenticate( identity, password, client ){
        let res = {
            authenticated: false,
            reason: null,
            acr: null,
            canContinue: true
        };
        // first check for identity authentication mode configured by the client - defaulting to 'none' here
        if( client.record.identity_auth_mode === 'auth' ){
            // and then search for an IIdentityAuth provider selected by the organization and willing to authenticate
            const organization = this.iRequestServer().organization();
            const providers = Organizations.fn.byType( organization, IIdentityAuth );
            if( !providers || !Object.keys( providers ).length ){
                console.warn( 'organization didn\'t select any IIdentityAuth provider' );
                res.reason = Meteor.APP.C.NO_AUTHENTICATION_PROVIDER;

            } else {
                let found = false;
                for await( const it of Object.keys( providers )){
                    const p = providers[it].provider;
                    assert( p && p instanceof izProvider, 'expects an izProvider, got '+p );
                    if( await p.willingTo( identity, password, client )){
                        await p.authenticate( res, identity, password, client );
                        found = true;
                        res.canContinue = res.authenticated;
                        break;
                    }
                };
                if( !found ){
                    res.reason = Meteor.APP.C.NO_WILLING_TO_PROVIDER;
                }
            }
        } else {
            res.reason = Meteor.APP.C.IDENTITY_AUTH_MODE_NONE;
        }
        return res;
    }

    /**
     * @summary Authorize the identity
     * @param {Object} identity the found identity
     * @param {Object} client an { entity, record } object
     * @returns {Object} with following keys:
     *  - authorized: {Boolean} true if the identity is authorized to the client
     *  - authorizations: if authorized, the list of authorizations which apply to this identity for this client
     *  - reason: the reason why it is not authorized,
     *  - canContinue: whether this IdentityServer considers that login process can continue
     */
    async authorize( identity, client ){
        let res = {
            authorized: false,
            authorizations: null,
            reason: null,
            canContinue: true
        };
        // first check for identity access mode configured by the client
        if( client.record.identity_access_mode === 'auth' ){
            // then search for authorizations where subject is one of the identity groups, and object this client
            const organization = this.iRequestServer().organization();
            const memberOf = identity.DYN.memberOf.all || [];
            const query = {
                subject_type: 'I',
                subject_id: { $in: memberOf },
                object_type: 'C',
                object_id: client.entity._id
            };
            const authorizations = await Authorizations.s.transformedGetBy( organization.entity._id, query, null, { from: identity.organization });
            if( authorizations.length ){
                res.authorized = true;
                res.authorizations = authorizations;
            } else {
                res.reason = Meteor.APP.C.NOT_AUTHORIZED;
                res.canContinue = false;
            }
        } else {
            res.reason = Meteor.APP.C.IDENTITY_ACCESS_MODE_ALL;
        }
        return res;
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
     *       acr: 'urn:org.trychlos.iziam:password:0',
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
     * Please note that we should identify our identities on their '_id' identifier which doesn't depend of the connected client.
     * This is a design choice to identify the ResourceOwner rather than the usage he/she chooses to make of his/her permissions.
     * But.. oidc-provider refuses to get anything else than the provided 'id'
     */
    async findAccount( organization, ctx, id, token ){
        //console.debug( 'findAccount()', arguments );
        const identity = await Identities.s.findById( organization, id, { from: organization.entity._id });
        //console.debug( 'identity', identity );
        const client = token && token.clientId ? await Clients.s.byClientIdAtDate( token.clientId, { from: organization.entity._id }) : null;
        // seems that oidc-provider doesn't accept another subject that the provided id
        const subject = id;
        //const subject = identity ? this.subject( identity ) : null;
        return identity ? {
            accountId: subject,
            async claims( use, scope, claims, rejected ){
                return await Identities.claims.oidcRequest( organization, identity, subject, use, scope, claims, rejected, client );
            }
        } : null;
    }

    /**
     * @param {Object} organization an { entity, record } object
     * @param {String} login
     * @param {String} password
     * @param {String} clientId
     * @return {Object} with following keys:
     *  - identity: found identity, or null
     *  - authenticated: whether the identity has been authenticated
     *  - authorized: whether the identity is authorized to
     *  - reasons: the array of reasons for which the identity is not authenticated or not authorized
     *  - acr, when authenticated, the Authentication Context class Reference
     *  - authorizations: when authorized, the list of authorizations which apply to this identity for this client
     *  - canContinue: whether this IdentityServer considers that login process can continue
     * 
     *  See also https://github.com/panva/node-oidc-provider/blob/v7.14.3/docs/README.md#accounts
     *  This is only used from the interaction '/interaction/:uid/login' route
     */
    async findByLogin( organization, login, password, clientId ){
        //console.debug( 'findByLogin', arguments );
        let result = {
            identity: null,
            authenticated: false,
            authorized: false,
            reasons: [],
            acr: null,
            authorizations: null,
            canContinue: false
        };
        result.identity = await Identities.s.findById( organization, login, { from: organization.entity._id });
        if( result.identity ){
            const client = await Clients.s.byClientIdAtDate( clientId );
            let res = await this.authenticate( result.identity, password, client );
            result.authenticated = res.authenticated;
            if( res.reason ){
                result.reasons.push( res.reason );
            }
            result.acr = res.acr;
            result.canContinue = res.canContinue;
            // identity can be un-authenticated, but nonetheless authorized..
            if( res.canContinue ){
                res = await this.authorize( result.identity, client );
                result.authorized = res.authorized;
                result.authorizations = res.authorizations;
                if( res.reason ){
                    result.reasons.push( res.reason );
                }
                result.canContinue = res.canContinue;
            }
        }
        return result;
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
