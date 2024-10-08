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

import { Clients } from '/imports/common/collections/clients/index.js';
import { Organizations } from '/imports/common/collections/organizations/index.js';

import { OpenID } from '/imports/common/providers/openid-functions.js';

import { Jwks } from '/imports/common/tables/jwks/index.js';
import { Keygrips } from '/imports/common/tables/keygrips/index.js';

import { AuthServer } from '/imports/server/classes/auth-server.class.js';
import { HtmlError } from '/imports/server/classes/html-error.class.js';
import { OIDMongoAdapter } from '/imports/server/classes/oid-mongo-adapter.class.js';

import { IRenderer } from '/imports/server/interfaces/irenderer.iface.js';

export class OIDAuthServer extends mix( AuthServer ).with( IRenderer ){

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
        let result = null;
        if( client && client.record.enabled ){
            result = {
                payload: await Clients.s.registeredMetadata( client )
            }
        }
        return result;
    }

    // private data

    #oidc = null;
    #routes = null;

    // private methods

    /*
     * @param {Organizations} organization as an { entity, record } object
     * @returns {Object} the configuration needed for this OIDAuthServer (and the underlying OpenID Connect Provider)
     */
    async _config( organization ){
        let conf = {
            features: {
                devInteractions: {
                    enabled: false
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
        let endpoints = OpenID.fn.endpoints( organization );
        conf.routes = {};
        Object.keys( endpoints ).forEach(( it ) => {
            const key = it.replace( /_endpoint$|_uri$/, '' );
            try {
                const url = new URL( endpoints[it] );
                conf.routes[key] = url.pathname;
            } catch {
                // just ignore
            };
        });
        // enable the token introspection if we have a configured endpoint for that
        if( conf.routes.introspection ){
            conf.features.introspection = { enabled: true };
        }

        // https://github.com/panva/node-oidc-provider/blob/v7.14.3/docs/README.md#accounts
        // define IdentityServer
        conf.findAccount = this.iRequestServer().identityServer().findAccount;

        // https://github.com/panva/node-oidc-provider/blob/v7.14.3/docs/README.md#interactionsurl
        // make sure our interactions url is prefixed with our base url
        conf.interactions = {
            async url( ctx, interaction ){
                //console.debug( 'ctx', ctx, 'interaction', interaction );
                return organization.record.baseUrl+'/interaction/'+interaction.uid;
                //return organization.record.baseUrl+'/interaction';
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
        await OIDMongoAdapter.connect( 'oid_adapter_' );
        conf.adapter = OIDMongoAdapter;
        // error rendering
        conf.renderError = this._renderError;
        return conf;
    }

    // install our middlewares in our newly instanciated oidc-provider
    async _installMiddlewares(){
        //console.debug( 'installing middlewares' );
        const requestServer = this.iRequestServer();
        const organization = requestServer.organization();
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

            /* pre-processing
             * you may target a specific action here by matching `ctx.path`
             */
            console.log( 'pre middleware', ctx.method, ctx.path );

            const url = ctx.path.substring( organization.record.baseUrl.length );
            const words = url.split( '/' );
            //console.debug( 'url', url, 'words', words );

            // GET /iziam/interaction/:uid
            if( ctx.method === 'GET' && words[1] === 'interaction' && words.length === 3 ){
                await self.renderGetInteraction( self.#oidc, ctx, next )
            }

            // POST /iziam/interaction/:uid/login
            if( ctx.method === 'POST' && words[1] === 'interaction' && words[3] === 'login' && words.length === 4 ){
                await self.renderPostLogin( self.#oidc, ctx, next )
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

    // builds the HTML code used to render an error
    async _renderError( ctx, out, error ){
        ctx.type = 'html';
        ctx.body = new HtmlError( out, error ).render();
    }

    // public data

    /**
     * Constructor
     * @param {RequestServer} server the parent RequestServer instance
     * @returns {OIDAuthServer}
     */
    constructor(){
        super( ...arguments );
        console.debug( 'instanciating OIDAuthServer' );
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
        this.#oidc.callback()( args.req(), args.res(), args.next());
    }

    /**
     * @summary Make sure the server is initialized
     *  We would wish have an OIDC Provider with the same time life as this AuthServer
     *  but the former requires a configuration which can be changed over time
     */
    async init(){
        console.debug( 'initializing', this );
        const self = this;
        const requestServer = this.iRequestServer();
        const organization = requestServer.organization();
        const issuer = Organizations.fn.fullBaseUrl( organization );
        let setup = await this._config( organization );
        console.debug( this, 'setup', setup );
        this.#oidc = new Provider( issuer, setup );
        assert( this.#oidc && this.#oidc instanceof Provider, 'expects an instance of (node-oidc-) Provider, got '+this.#oidc );
        await self._installMiddlewares();
        // from https://github.com/panva/node-oidc-provider/blob/main/example/express.js
        WebApp.handlers.use( organization.record.baseUrl, self.#oidc.callback());
   }
}
