/*
 * /imports/server/classes/oid-auth-server.class.js
 *
 * An Authorization Server for OpenID.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x
import Provider from 'oidc-provider';

import { WebApp } from 'meteor/webapp';

import { Clients } from '/imports/common/collections/clients/index.js';
import { Organizations } from '/imports/common/collections/organizations/index.js';

import { Jwks } from '/imports/common/tables/jwks/index.js';
import { Keygrips } from '/imports/common/tables/keygrips/index.js';

import { AuthServer } from '/imports/server/classes/auth-server.class.js';
import { HtmlError } from '/imports/server/classes/html-error.class.js';
import { OIDMongoAdapter } from '/imports/server/classes/oid-mongo-adapter.class.js';

export class OIDAuthServer extends AuthServer {

    // static data

    // static methods

    /**
     * @summary Convert a { entity, record } client object into a format suitable for use by OpenID Auth Server
     * @param {String} clientId the client identifier
     * @returns {Object} a client suitable for use by openid auth server, or null
     */
    static async byClientId( clientId ){
        const client = await Clients.s.byClientIdAtDate( clientId );
        let result = null;
        if( client && client.enabled ){
            result = {
                client_id: client.entity.clientId,
                grant_types: client.record.grant_types,
                token_endpoint_auth_method: client.record.token_endpoint_auth_method
            };
            if( client.record.redirect_uris && client.record.redirect_uris.length > 0 ){
                result.redirect_uris = [];
                client.record.redirect_uris.map( it => result.redirect_uris.push( it.uri ));
            }
        }
        return result;
    }

    // private data

    #oidc = null;

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
        // organization setup
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
            }
        });
        let endpoints = Organizations.fn.endpoints( organization );
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
            conf.features.introspection = true;
        }
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

    // returns a new OIDC Provider
    //  must have at least an issuer
    async _newOIDCProvider(){
        const requestServer = this.iRequestServer();
        const organization = requestServer.organization();
        const issuer = Organizations.fn.fullBaseUrl( organization );
        let setup = await this._config( organization );
        console.debug( this, 'setup', setup );
        const oidc = new Provider( issuer, setup );
        return oidc;
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
        this._newOIDCProvider()
            .then(( oidc ) => {
                this.#oidc = oidc;
            })
            .then(() => {
                // install middlewares
                this._installMiddlewares();
            })
            .then(() => {
                // from https://github.com/panva/node-oidc-provider/blob/main/example/express.js
                const organization = this.iRequestServer().organization();
                WebApp.handlers.use( organization.record.baseUrl, self.#oidc.callback());
            });
    }
}
