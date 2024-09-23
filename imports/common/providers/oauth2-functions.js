/*
 * /imports/common/providers/oauth2-functions.js
 *
 * OAuth 2 functions
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { Organizations } from '/imports/common/collections/organizations/index.js';

export const OAuth2 = {};

OAuth2.fn = {
    /**
     * @param {Organizations} organization as an { entity, record } object
     * @returns {Object} the list of configured endpoints
     */
    endpoints( organization ){
        let result = {};
        const fullBaseUrl = Organizations.fn.fullBaseUrl( organization );
        const set = function( name, opts={} ){
            let foo = organization.record[opts.fromName] || organization.record[name];
            if( foo ){
                result[name] = fullBaseUrl+foo;
            }
        };
        set( 'authorization_endpoint' );
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
        // scopes_supported
        // response_types_supported
        // response_modes_supported
        // token_endpoint_auth_methods_supported
        // token_endpoint_auth_signing_alg_values_supported
        // service_documentation
        // ui_locales_supported
        // revocation_endpoint_auth_methods_supported
        // revocation_endpoint_auth_signing_alg_values_supported
        // introspection_endpoint_auth_methods_supported
        // introspection_endpoint_auth_signing_alg_values_supported
        // code_challenge_methods_supported
        return data;
    }
};
