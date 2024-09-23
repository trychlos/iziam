/*
 * /imports/common/providers/openid-functions.js
 *
 * OpenID Connect functions
 * 
 * Because OpenID is an extension of OAuth 2, then most of the below functions returns OAuth consolidated values.
 * The caller doesn't need to do it itself.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { Organizations } from '/imports/common/collections/organizations/index.js';

import { OAuth2 } from '/imports/common/providers/oauth2-functions.js';

export const OpenID = {};

OpenID.fn = {
    /**
     * @param {Organizations} organization as an { entity, record } object
     * @returns {Object} the list of configured endpoints
     */
    endpoints( organization ){
        let result = OAuth2.fn.endpoints( organization );
        const fullBaseUrl = Organizations.fn.fullBaseUrl( organization );
        const set = function( name, opts={} ){
            let foo = organization.record[opts.fromName] || organization.record[name];
            if( foo ){
                result[name] = fullBaseUrl+foo;
            }
        };
        set( 'userinfo_endpoint' );
        return result;
    },

    /**
     * @param {Organizations} organization as an { entity, record } object
     * @returns {Object} the public OpenId metadata document as for [RF C 8414](https://datatracker.ietf.org/doc/html/rfc8414)
     */
    metadata( organization ){
        let data = OAuth2.fn.metadata( organization );
        const set = function( name, opts={} ){
            let foo = organization.record[opts.fromName] || organization.record[name];
            if( foo ){
                data[name] = foo;
            }
        };
        // OAuth2 metadata already contains OAuth2 endpoints, and OpenID endpoints too contains OAuth2 endpoints
        //  merge will just return one occurrence
        _.merge( data, OpenID.fn.endpoints( organization ));
        set( 'op_policy_uri', { fromName: 'pdmpUrl' });
        set( 'op_tos_uri', { fromName: 'gtuUrl' });
        // acr_values_supported
        // subject_types_supported
        // id_token_signing_alg_values_supported
        // id_token_encryption_alg_values_supported
        // id_token_encryption_enc_values_supported
        // userinfo_signing_alg_values_supported
        // userinfo_encryption_alg_values_supported
        // userinfo_encryption_enc_values_supported
        // request_object_signing_alg_values_supported
        // request_object_encryption_alg_values_supported
        // request_object_encryption_enc_values_supported
        // display_values_supported
        // claim_types_supported
        // claims_supported
        // claims_locales_supported
        // claims_parameter_supported
        // request_parameter_supported
        // request_uri_parameter_supported
        // require_request_uri_registration
        return data;
    }
};
