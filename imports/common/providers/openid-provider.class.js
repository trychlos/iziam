/*
 * /imports/common/providers/openid-provider.class.js
 *
 * A simple (though mandatory) provider which defines the 'openid' scope.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import mix from '@vestergaard-company/js-mixin';

import { izProvider } from '/imports/common/classes/iz-provider.class.js';

import { Organizations } from '/imports/common/collections/organizations/index.js';

import { IGrantType } from '/imports/common/interfaces/igranttype.iface.js';
import { IRequestable } from '/imports/common/interfaces/irequestable.iface.js';

//import { RequestServer } from '/imports/server/classes/request-server.class.js';
//import { OIDAuthServer } from '/imports/server/classes/oid-auth-server.class.js';

export class OpenIDProvider extends mix( izProvider ).with( IGrantType, IRequestable ){

    // static data

    // keep the instanciated handling servers in a hash indexed per entity
    static RequestServersByEntity = {};
    static Singleton = null;

    // static methods

    // the organization has selected an OpenID provider
    // to handle it, and whatever be the client, we have to pass through the OpenID web handler provided by [OIDC provider](https://github.com/panva/node-oidc-provider)
    // once done, other handlers have no chance to be able to handle it
    static async handleAsterRequest( it, args, organization ){
        /*
        let server = OpenIDProvider.RequestServersByEntity[organization.entity._id];
        if( !server ){
            server = new RequestServer( OpenIDProvider.Singleton, organization, { auth: OIDAuthServer });
            OpenIDProvider.RequestServersByEntity[organization.entity._id] = server;
        }
        await server.handle( args, organization );
        */
        return true;
    }

    // private data

    // private methods

    // public data

    /**
     * Constructor
     * @returns {OpenIDProvider}
     */
    constructor(){
        super({
            iident: {
                id: 'org.trychlos.iziam.provider.openid.0',
                label: 'izIAM OpenID Provider',
                origin: 'izIAM'
            },
            ifeatured: [
                'openid',
                'openid-connect-1.0'
            ],
            igranttype: [
                'hybrid'
            ],
            irequestable: [
                {
                    method: 'GET',
                    path: Meteor.APP.C.openidMetadataPath,
                    async fn( url, args, organization ){
                        args.answer( Organizations.fn.metadata( organization ));
                        args.end();
                        return true;
                    }
                },
                {
                    method: 'GET',
                    path: '*',
                    async fn( url, args, organization ){
                        return OpenIDProvider.handleAsterRequest( url, args, organization );
                    }
                }
            ],
            irequires: [
                'oauth2'
            ]
            /*
            iresource: {
                '.': {
                    openid: [
                        'sub'
                    ]
                }
            },
            */
        });

        OpenIDProvider.Singleton = this;
        return this;
    }

    /*
     * @summary Provide the claims for this scope
     * @locus Server
     * @param {Object} ctx
     * @param {String} token access token
     * 
     *  token AuthorizationCode {
     *    iat: 1704452548,
     *    exp: 1704453148,
     *    accountId: 'un@un.un',
     *    authTime: 1704452548,
     *    codeChallenge: 'gtd4PieekE4hELVDD_ax5erNnCH0-qbGw_Zn02SFwuo',
     *    codeChallengeMethod: 'S256',
     *    grantId: 'cciMSS-bqoH5dP5X7ybfAEl8IRonCPWzLfQJhBJN669',
     *    redirectUri: 'https://xps13.trychlos.lan/_oauth/iziam',
     *    resource: 'urn:iziam:identity',
     *    scope: 'openid iz_profile two',
     *    sessionUid: '_pYw2Kao-hQZVDOlYPdSb',
     *    clientId: '4dbceb9cb1a7493fa1ac1ffb29ae3a15',
     *    expiresWithSession: true,
     *    kind: 'AuthorizationCode',
     *    jti: '-oyTdEi807dnFydnSr8V_dELXyF5_sa3_hfr6RXbaW4'
     *  }
     * 
     * @param {String} use 'id_token' or 'userinfo'
     * @param {String} scope the scope to be examined
     * @param {Object} claims the part of the claims authorization parameter for either "id_token" or "userinfo" (depends on the "use" param)
     * @param {Array<String} rejected rejected claim names that were rejected by the end-user, you might want to skip loading some claims
     *  from external resources or through db projection
     * @param {Object} oidc our own OIDC object which holds Client/Resource/Identity servers
     * @param {Object} identity the identity object as found by the IdentityServer
     * @returns {Promise} which eventually will resolve to a claims object, or null
     */
    async claims( ctx, token, use, scope, claims, rejected, oidc, identity ){
        //console.debug( 'token', token, 'ctx', ctx, 'ctx.oidc', ctx.oidc, 'oidc', oidc, 'identity', identity );
        let res = null;
        switch( scope ){
            case 'openid':
                res = {
                    sub: token.accountId
                }
        }
        return Promise.resolve( res );
    }
}
