/*
 * /imports/common/classes/oauth2-fn.js
 *
 * OAuth 2 functions
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { OAuth2 } from '/imports/common/classes/oauth2.class.js';

import { Organizations } from '/imports/common/collections/organizations/index.js';

export const _oauth2_fn = {
    /**
     * @param {Organizations} organization as an { entity, record } object
     * @returns {Object} the list of configured endpoints
     */
    endpoints( organization ){
        let result = {};
        const fullBaseUrl = Organizations.fn.fullBaseUrl( organization );
        //console.debug( 'fullBaseUrl', fullBaseUrl );
        const set = function( name, opts={} ){
            let foo = organization.record[opts.fromName] || organization.record[name];
            if( foo ){
                result[name] = fullBaseUrl+foo;
            }
        };
        set( 'authorization_endpoint' );
        set( 'end_session_endpoint' );
        set( 'introspection_endpoint' );
        set( 'jwks_uri' );
        set( 'revocation_endpoint' );
        set( 'registration_endpoint' );
        set( 'token_endpoint' );
        return result;
    },

    /**
     * @param {Organizations} organization as an { entity, record } object
     * @returns {Object} the public OAuth metadata document as for [RFC 8414](https://datatracker.ietf.org/doc/html/rfc8414)
     */
    metadata( organization ){
        console.debug( 'OAuth2 metadata' );
        let data = {
            // always set because we have a default value in settings
            issuer: Organizations.fn.fullBaseUrl( organization )
        };
        const set = function( name, opts={} ){
            let foo = organization.record[opts.fromName] || organization.record[name];
            if( foo ){
                data[name] = foo;
            }
        };
        _.merge( data, OAuth2.fn.endpoints( organization ));
        data.grant_types_supported = Organizations.fn.supportedGrantTypes( organization );
        data.token_endpoint_auth_methods_supported = Organizations.fn.supportedAuthMethods( organization );
        // scopes_supported
        // response_types_supported
        // response_modes_supported
        // token_endpoint_auth_signing_alg_values_supported
        // service_documentation
        // ui_locales_supported
        // revocation_endpoint_auth_methods_supported
        // revocation_endpoint_auth_signing_alg_values_supported
        // introspection_endpoint_auth_methods_supported
        // introspection_endpoint_auth_signing_alg_values_supported
        // code_challenge_methods_supported

        // try to fix 'id_token_signed_response_alg must not be provided (no values are allowed)' error
        //data.idTokenSigningAlgValues = [ 'RS256', 'PS256', 'ES256', 'EdDSA' ];
        //data.idTokenSigningAlgValues = [ 'none', 'RS256', 'PS256', 'ES256', 'EdDSA' ];
        //data.id_token_signing_alg_values = [ 'RS256', 'PS256', 'ES256', 'EdDSA' ];
        // [OpenID Connect Discovery 1.0 incorporating errata set 2](https://openid.net/specs/openid-connect-discovery-1_0.html)
        // OpenID server metadata
        data.id_token_signing_alg_values_supported = [ 'RS256', 'PS256', 'ES256', 'EdDSA' ];
        return data;
    }
};
