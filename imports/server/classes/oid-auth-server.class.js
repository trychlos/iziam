/*
 * /imports/server/classes/oid-auth-server.class.js
 *
 * An Authorization Server for OpenID.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x
import mix from '@vestergaard-company/js-mixin';
import Provider from 'oidc-provider';

import { WebApp } from 'meteor/webapp';

import { Claim } from '/imports/common/classes/claim.class.js';
import { OpenID } from '/imports/common/classes/openid.class.js';
import { Scope } from '/imports/common/classes/scope.class.js';

import { Organizations } from '/imports/common/collections/organizations/index.js';

import { Jwks } from '/imports/common/tables/jwks/index.js';
import { Keygrips } from '/imports/common/tables/keygrips/index.js';

import { AuthServer } from '/imports/server/classes/auth-server.class.js';
import { OIDErrors } from '/imports/server/classes/oid-errors.class.js';
import { OIDLogout } from '/imports/server/classes/oid-logout.class.js';
import { OIDMongoAdapter } from '/imports/server/classes/oid-mongo-adapter.class.js';

import { IOIDInteractions } from '/imports/server/interfaces/ioid-interactions.iface.js';

export class OIDAuthServer extends mix( AuthServer ).with( IOIDInteractions ){

    // static data

    // static methods

    // private data

    // the OIDC Provider instance
    #oidc = null;

    // private methods

    /*
     * @param {Organizations} organization as an { entity, record } object
     * @returns {Object} the configuration needed for this OIDAuthServer (and the underlying OpenID Connect Provider)
     */
    async _config( organization ){
        const self = this;
        let conf = {
            features: {
                devInteractions: {
                    enabled: false
                },
                rpInitiatedLogout: {
                    enabled: true,
                    logoutSource: this._logoutSource
                }
            }
        };
        // organization OIDC Provider setup
        conf.jwks = Jwks.fn.authKeys( organization );
        _.merge( conf, {
            cookies: {
                keys: Keygrips.fn.authKeys( organization ),
                long: {
                    signed: true
                },
                short: {
                    signed: true
                }
            },
            ttl: {
                Session: 60000, // not sure if unit to be used is ms ?
                Interaction: 60000
            }
        });
        // provide routes endpoints
        //  NB: they must be provided without the baseUrl as node-oidc-provider will prefix these with the mount path
        let endpoints = OpenID.fn.endpoints( organization );
        conf.routes = {};
        Object.keys( endpoints ).forEach(( it ) => {
            const key = it.replace( /_endpoint$|_uri$/, '' );
            try {
                const url = new URL( endpoints[it] );
                conf.routes[key] = url.pathname.substring( organization.record.baseUrl.length );
            } catch {
                // just ignore
            };
        });
        // enable the token introspection if we have a configured endpoint for that
        if( conf.routes.introspection ){
            conf.features.introspection = { enabled: true };
        }
        // enable the token userinfo if we have a configured endpoint for that
        if( conf.routes.userinfo ){
            conf.features.userinfo = { enabled: true };
        }

        // supported scopes
        //  'openid' and 'offline_access' are set by default, but adding scopes removes 'offline_access', leaving only 'openid' plus additional scopes
        conf.scopes = Scope.scopeList();

        // supported claims
        //  'openid' and 'offline_access' are set by default, but adding scopes removes 'offline_access', leaving only 'openid' plus additional scopes
        conf.claims = Claim.claimList();

        // https://github.com/panva/node-oidc-provider/blob/v7.14.3/docs/README.md#accounts
        // define IdentityServer
        //conf.findAccount = this.iRequestServer().identityServer().findAccount;
        conf.findAccount = async ( ctx, id, token ) => {
            const identityServer = self.iRequestServer().identityServer();
            const organization = self.iRequestServer().organization();
            return await identityServer.findAccount( organization, ctx, id, token );
        };

        // https://github.com/panva/node-oidc-provider/blob/v7.14.3/docs/README.md#interactionsurl
        // make sure our interactions url is prefixed with our base url
        conf.interactions = {
            async url( ctx, interaction ){
                return organization.record.baseUrl + Meteor.APP.C.oidcInteractionPath + '/' + interaction.uid;
            }
        };

        // https://github.com/panva/node-oidc-provider/blob/410bdaa88342da8a75b6cfd08d51d218acd23bbe/lib/helpers/defaults.js#L650
        // description: Default client metadata to be assigned when unspecified by the client metadata,
        // e.g. during Dynamic Client Registration or for statically configured clients.
        //conf.clientDefaults = {
        //    grant_types: ['authorization_code'],
        //    id_token_signed_response_alg: 'RS256',
        //    response_types: ['code'],
        //    token_endpoint_auth_method: 'client_secret_basic',
        //},

        // have a Mongo adapter for storing issued tokens, codes, user sessions, dynamically registered clients, etc.
        await OIDMongoAdapter.connect( 'oidc_' );
        conf.adapter = OIDMongoAdapter;

        // error rendering
        conf.renderError = this._errorRender;

        // TTLs
        conf.ttl = {
            AccessToken: organization.record.ttl_AccessToken || Meteor.APP.C.ttl_AccessToken,
            ClientCredentials: organization.record.ttl_ClientCredentials || Meteor.APP.C.ttl_ClientCredentials,
            Grant: organization.record.ttl_Grant || Meteor.APP.C.ttl_Grant,
            IdToken: organization.record.ttl_IdToken || Meteor.APP.C.ttl_IdToken,
            Interaction: organization.record.ttl_Interaction || Meteor.APP.C.ttl_Interaction,
            Session: organization.record.ttl_Session || Meteor.APP.C.ttl_Session
        };

        // unfortunately, the node-oidc-provider is written so that the configuration set at instanciation time is not modifiable
        //  have to find a way to reset it...
        return conf;
    }

    // builds the HTML code used to render an error
    // this function is called outside of any class context, so this is not defined
    async _errorRender( ctx, out, error ){
        ctx.type = 'html';
        ctx.body = new OIDErrors( out, error ).render();
    }

    // install a body parser to handle POST requests
    // the iRequestServer router will be mounted under baseUrl, so is dedicated to this organization
    async _installBodyParser( router ){
        console.debug( 'installing', this.iRequestServer().organization().record.baseUrl, 'bodyParser middlewares' );
        router.use( WebApp.express.urlencoded({ extended: true, type: 'application/x-www-form-urlencoded' }));
        router.use( WebApp.express.json());
    }

    // install interactions routes
    //  must be defined without the baseUrl as these routes are to be mounted under this same baseUrl
    async _installInteractions( router ){
        console.debug( 'installing', this.iRequestServer().organization().record.baseUrl, 'interactions middlewares' );
        const setNoCache = function( req, res, next ){
            res.set('cache-control', 'no-store');
            next();
        };
        router.get( Meteor.APP.C.oidcInteractionPath+'/:uid', setNoCache, async ( req, res, next ) => {
            return this.interactionGetLogin( this.#oidc, req, res, next );
        });
        router.post(  Meteor.APP.C.oidcInteractionPath+'/:uid/login', setNoCache, async ( req, res, next ) => {
            return this.interactionPostLogin( this.#oidc, req, res, next );
        });
        router.post(  Meteor.APP.C.oidcInteractionPath+'/:uid/confirm', setNoCache, async ( req, res, next ) => {
            return this.interactionPostConfirm( this.#oidc, req, res, next );
        });
        router.get(  Meteor.APP.C.oidcInteractionPath+'/:uid/abort', setNoCache, async ( req, res, next ) => {
            return this.interactionGetAbort( this.#oidc, req, res, next );
        });
        router.get(  Meteor.APP.C.oidcInteractionPath+'/:uid/cancel', setNoCache, async ( req, res, next ) => {
            return this.interactionGetCancel( this.#oidc, req, res, next );
        });
    }

    // install the OIDC pre- and post-middlewares
    async _installOIDCMiddleware(){
        console.debug( 'installing', this.iRequestServer().organization().record.baseUrl, 'OIDC middleware' );
        const self = this;
        this.#oidc.use( async ( ctx, next ) => {
            // ctx: {
            //     request: {
            //       method: 'GET',
            //       url: '/openid-configuration',
            //       header: {
            //         'x-forwarded-host': 'localhost:3000',
            //         'x-forwarded-proto': 'http',
            //         'x-forwarded-port': '3000',
            //         'x-forwarded-for': '127.0.0.1',
            //         accept: '*/*',
            //         'user-agent': 'curl/8.0.1',
            //         host: 'localhost:3000',
            //         connection: 'keep-alive'
            //       }
            //     },
            //     response: {
            //       status: 404,
            //       message: 'Not Found',
            //       header: [Object: null prototype] {
            //         'content-type': 'application/json; charset=utf-8'
            //       }
            //     },
            //     app: { subdomainOffset: 2, proxy: false, env: 'development' },
            //     originalUrl: '/openid-configuration',
            //     req: '<original node req>',
            //     res: '<original node res>',
            //     socket: '<original node socket>'
            // }
            //
            // ctx.path:            /auth
            // ctx.req.originalUrl: /iziam/auth
            // ctx.req.baseUrl:     /iziam
            // ctx.href:            http://localhost:3003/auth?client....

            /* pre-processing
             * you may target a specific action here by matching `ctx.path`
             */
            console.log( 'pre middleware', ctx.method, ctx.path );

            // have to run the end of session ourselves as oidc-provider doesn't do it (or I don't understand how to) :(
            if( ctx.method === 'GET' && ctx.path === '/logout' ){
                return OIDLogout.endSession( self.#oidc, ctx, next );
            }

            await next();

            /* post-processing
             * since internal route matching was already executed you may target a specific action here
             * checking `ctx.oidc.route`, the unique route names used are
             *
             * `authorization`
             * `backchannel_authentication`
             * `client_delete`
             * `client_update`
             * `client`
             * `code_verification`
             * `cors.device_authorization`
             * `cors.discovery`
             * `cors.introspection`
             * `cors.jwks`
             * `cors.pushed_authorization_request`
             * `cors.revocation`
             * `cors.token`
             * `cors.userinfo`
             * `device_authorization`
             * `device_resume`
             * `discovery`
             * `end_session_confirm`
             * `end_session_success`
             * `end_session`
             * `introspection`
             * `jwks`
             * `pushed_authorization_request`
             * `registration`
             * `resume`
             * `revocation`
             * `token`
             * `userinfo`
             */
            //console.log( 'post middleware', ctx );
            // as of oidc-provider 7.14.3, there is no ctx.oidc when the route is wrong
            console.log( 'post middleware', ctx.method, ctx.oidc?.route );
        });
    }

    // install a body parser to handle POST requests
    // the iRequestServer router will be mounted under baseUrl, so is dedicated to this organization
    async _installTrace( router ){
        const baseUrl = this.iRequestServer().organization().record.baseUrl;
        console.debug( 'installing', baseUrl, 'trace middleware' );
        if( true ){
            router.use(( req, res, next ) => {
                console.debug( 'router', baseUrl, req.method, req.url );
                next();
            });
        }
    }

    // builds the HTML code to ask for user logout confirmation
    async _logoutSource( ctx, form ){
        //ctx.type = 'html';
        //const html = new OIDLogout( ctx, form ).render();
        //ctx.res.send( html );
        await new OIDLogout( ctx, form ).render();
    }

    // public data

    /**
     * Constructor
     * @param {RequestServer} server the parent RequestServer instance
     * @returns {OIDAuthServer}
     */
    constructor( server ){
        super( ...arguments );
        return this;
    }

    /**
     * @summary Handle a request
     * @param {String} url
     * @param {WebArgs} args
     *  This is called from IRequestable.request() to handle aster path when the provider exhibits one.
     *  There is no expected returned value, but should answer() and must end().
     */
    async handle( url, args ){
        //console.debug( 'this', this, 'this.#oidc', this.#oidc, 'url', url, 'args', args );
        assert( this.#oidc && this.#oidc instanceof Provider, 'expects an instance of (node-oidc-) Provider, got '+this.#oidc );
        console.debug( 'handling', args.req().url );
        this.#oidc.callback()( args.req(), args.res(), args.next());
    }

    /**
     * @summary Make sure the server is initialized
     *  We would wish have an OIDC Provider with the same time life as this AuthServer
     *  but the former requires a configuration which can be changed over time
     * @returns {Boolean} true if success
     */
    async init(){
        let success = false;
        const requestServer = this.iRequestServer();
        const organization = requestServer.organization();
        console.debug( 'initializing', organization.record.baseUrl, this );
        const issuer = Organizations.fn.fullBaseUrl( organization );
        const setup = await this._config( organization );
        console.debug( organization.record.baseUrl, this, 'setup', setup );
        try {
            this.#oidc = new Provider( issuer, setup );
            if( this.#oidc ){
                assert( this.#oidc instanceof Provider, 'expects an instance of (node-oidc-) Provider, got '+this.#oidc );
                const router = this.iRequestServer().router();
                await this._installTrace( router );
                await this._installBodyParser( router );
                await this._installInteractions( router );
                await this._installOIDCMiddleware();
                // from https://github.com/panva/node-oidc-provider/blob/main/example/express.js
                //  https://v3-migration-docs.meteor.com/breaking-changes/#webapp-switches-to-express
                //  https://forums.meteor.com/t/what-is-the-meteor-3-express-replacement-for-picker-middleware/61616
                Meteor.APP.express.use( organization.record.baseUrl, router );
                Meteor.APP.express.use( organization.record.baseUrl, this.#oidc.callback());
                success = true;
            }
        } catch( err ){
            console.error( err );
        }
        return success;
    }
}
