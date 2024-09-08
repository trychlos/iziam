/*
 * /import/common/collections/organizations/fieldset.js
 *
 * The fields to be added to the Tenant's entity and to the Tenant's record.
 */

import { Forms } from 'meteor/pwix:forms';

import { Organizations } from './index.js';

Organizations.entityFieldset = function(){
    return null;
};

Organizations.recordFieldset = function(){
    return [
        {
            //added at the end
            fields: [
                // the REST base URL to be used as the base path for all REST requests
                // mandatory to enable the REST API, must be unique between all organizations, e.g. /abcd
                {
                    name: 'baseUrl',
                    type: String,
                    optional: true,
                    form_check: Organizations.checks.baseUrl,
                    form_type: Forms.FieldType.C.OPTIONAL
                },
                // -- providers
                // list of selected providers
                {
                    name: 'selectedProviders',
                    type: Array,
                    optional: true
                },
                // the provider IIdent identifier
                {
                    name: 'selectedProviders.$',
                    type: String
                },
                // -- dynamic registration
                // whether the organization allow dynamic registration by confidential clients
                {
                    name: 'dynamicRegistrationByConfidential',
                    type: Boolean,
                    defaultValue: false,
                    form_check: Organizations.checks.dynamicRegistrationByConfidential
                },
                // whether the organization allow dynamic registration by public clients
                {
                    name: 'dynamicRegistrationByPublic',
                    type: Boolean,
                    defaultValue: false,
                    form_check: Organizations.checks.dynamicRegistrationByPublic
                },
                // whether the organization allow dynamic registration by allowed authenticated users
                {
                    name: 'dynamicRegistrationByUser',
                    type: Boolean,
                    defaultValue: false,
                    form_check: Organizations.checks.dynamicRegistrationByUser
                },
                // -- configuration
                // whether this organization forces the usage of OAuth 2.1
                {
                    name: 'wantsOAuth21',
                    type: Boolean,
                    defaultValue: true,
                    form_check: Organizations.checks.wantsOAuth21
                },
                // whether this organization wants all public clients use PKCE (rfc7636)
                {
                    name: 'wantsPkce',
                    type: Boolean,
                    defaultValue: true,
                    form_check: Organizations.checks.wantsPkce
                },
                // -- Authorization Server Metadata
                // https://datatracker.ietf.org/doc/html/rfc8414#section-2
                // The authorization server's issuer identifier if we want override the settings value
                {
                    name: 'issuer',
                    type: String,
                    optional: true,
                    form_check: Organizations.checks.issuer,
                    form_type: Forms.FieldType.C.OPTIONAL
                },
                // URL of the authorization server's authorization endpoint (mandatory)
                {
                    name: 'authorization_endpoint',
                    type: String,
                    optional: true,
                    form_check: Organizations.checks.authorization_endpoint,
                    form_type: Forms.FieldType.C.OPTIONAL
                },
                // URL of the authorization server's token endpoint (mandatory)
                {
                    name: 'token_endpoint',
                    type: String,
                    optional: true,
                    form_check: Organizations.checks.token_endpoint,
                    form_type: Forms.FieldType.C.OPTIONAL
                },
                // URL of the authorization server's JWK Set [JWK] document
                {
                    name: 'jwks_uri',
                    type: String,
                    optional: true,
                    form_check: Organizations.checks.jwks_uri,
                    form_type: Forms.FieldType.C.OPTIONAL
                },
                // URL of the authorization server's OAuth 2.0 Dynamic Client Registration endpoint
                {
                    name: 'registration_endpoint',
                    type: String,
                    optional: true,
                    form_check: Organizations.checks.registration_endpoint,
                    form_type: Forms.FieldType.C.OPTIONAL
                },
                /*
                // array containing a list of the OAuth 2.0 [RFC6749] "scope" values that this authorization server supports
                //  Authorization Server Metadata defines that as a JSON array
                {
                    name: 'scopes_supported',
                    type: Array,
                    optional: true
                },
                {
                    name: 'scopes_supported.$',
                    type: String
                },
                */
                // array containing a list of the OAuth 2.0 "response_type" values that this authorization server supports
                //  Authorization Server Metadata defines that as a JSON array
                {
                    name: 'response_types_supported',
                    type: Array,
                    optional: true
                },
                {
                    name: 'response_types_supported.$',
                    type: String
                },
                // array containing a list of the OAuth 2.0 "response_mode" values that this authorization server supports
                //  Authorization Server Metadata defines that as a JSON array
                {
                    name: 'response_modes_supported',
                    type: Array,
                    optional: true
                },
                {
                    name: 'response_modes_supported.$',
                    type: String
                },
                // array containing a list of the OAuth 2.0 grant type values that this authorization server supports
                {
                    name: 'grant_types_supported',
                    type: Array,
                    optional: true
                },
                {
                    name: 'grant_types_supported.$',
                    type: String
                },
                // array containing a list of client authentication methods supported by this token endpoint
                {
                    name: 'token_endpoint_auth_methods_supported',
                    type: Array,
                    optional: true
                },
                {
                    name: 'token_endpoint_auth_methods_supported.$',
                    type: String
                },
                // array containing a list of the JWS signing algorithms ("alg" values) supported by the token endpoint
                {
                    name: 'token_endpoint_auth_signing_alg_values_supported',
                    type: Array,
                    optional: true
                },
                {
                    name: 'token_endpoint_auth_signing_alg_values_supported.$',
                    type: String
                },
                // URL of a page containing human-readable information that developers might want or need to know when using the
                // authorization server
                {
                    name: 'service_documentation',
                    type: String,
                    optional: true
                },
                // Languages and scripts supported for the user interface
                {
                    name: 'ui_locales_supported',
                    type: Array,
                    optional: true
                },
                {
                    name: 'ui_locales_supported.$',
                    type: String
                },
                // URL that the authorization server provides to the person registering the client to read about the authorization
                // server's requirements on how the client can use the data provided by the authorization server
                {
                    name: 'op_policy_uri',
                    type: String,
                    optional: true
                },
                // URL that the authorization server provides to the person registering the client to read about the authorization
                // server's terms of service
                {
                    name: 'op_tos_uri',
                    type: String,
                    optional: true
                },
                // URL of the authorization server's OAuth 2.0 revocation endpoint
                {
                    name: 'revocation_endpoint',
                    type: String,
                    optional: true
                },
                // array containing a list of client authentication methods supported by this revocation endpoint
                {
                    name: 'revocation_endpoint_auth_methods_supported',
                    type: Array,
                    optional: true
                },
                {
                    name: 'revocation_endpoint_auth_methods_supported.$',
                    type: String
                },
                // array containing a list of the JWS signing algorithms ("alg" values) supported by the revocation endpoint
                {
                    name: 'revocation_endpoint_auth_signing_alg_values_supported',
                    type: Array,
                    optional: true
                },
                {
                    name: 'revocation_endpoint_auth_signing_alg_values_supported.$',
                    type: String
                },
                // URL of the authorization server's OAuth 2.0 introspection endpoint
                {
                    name: 'introspection_endpoint',
                    type: String,
                    optional: true
                },
                // array containing a list of client authentication methods supported by this introspection endpoint
                {
                    name: 'introspection_endpoint_auth_methods_supported',
                    type: Array,
                    optional: true
                },
                {
                    name: 'introspection_endpoint_auth_methods_supported.$',
                    type: String
                },
                // array containing a list of the JWS signing algorithms ("alg" values) supported by the introspection endpoint
                {
                    name: 'introspection_endpoint_auth_signing_alg_values_supported',
                    type: Array,
                    optional: true
                },
                {
                    name: 'introspection_endpoint_auth_signing_alg_values_supported.$',
                    type: String
                },
                // array containing a list of Proof Key for Code Exchange (PKCE) [RFC7636] code challenge methods supported by this
                // authorization server
                {
                    name: 'code_challenge_methods_supported',
                    type: Array,
                    optional: true
                },
                {
                    name: 'code_challenge_methods_supported.$',
                    type: String
                },
                // A JWT containing metadata values about the authorization server as claims
                {
                    name: 'signed_metadata',
                    type: String,
                    optional: true
                },
                // -- the JSON Web Key Set
                // several JWK can be in this set to let the organization manage their renewals
                {
                    name: 'jwks',
                    type: Array,
                    optional: true
                },
                {
                    name: 'jwks.$',
                    type: Object
                },
                // key identifier (kid)
                {
                    name: 'jwks.$.id',
                    type: String
                },
                {
                    name: 'jwks.$.label',
                    type: String,
                    optional: true,
                    form_check: Organizations.checks.jwk_label,
                    form_type: Forms.FieldType.C.OPTIONAL
                },
                // the specific cryptographic algorithm used with the key
                {
                    name: 'jwks.$.alg',
                    type: String
                },
                // the usage chosen at creation
                {
                    name: 'jwks.$.use',
                    type: String,
                    optional: true,
                    form_check: Organizations.checks.jwk_use,
                    form_type: Forms.FieldType.C.MANDATORY
                },
                // the target operations
                {
                    name: 'jwks.$.opes',
                    type: Array,
                    optional: true
                },
                {
                    name: 'jwks.$.opes.$',
                    type: String
                },
                // pkcs8 export
                {
                    name: 'jwks.$.privateKey',
                    type: String
                },
                // spki export
                {
                    name: 'jwks.$.publicKey',
                    type: String
                },
                {
                    name: 'jwks.$.privateJwk',
                    type: Object,
                    blackbox: true
                },
                // publicJwk includes 'kty' (the family of cryptographic algorithms used with the key) field
                {
                    name: 'jwks.$.publicJwk',
                    type: Object,
                    blackbox: true
                },
                {
                    name: 'jwks.$.createdAt',
                    type: Date
                },
                {
                    name: 'jwks.$.createdBy',
                    type: String
                },
            ]
        }
    ];
};
