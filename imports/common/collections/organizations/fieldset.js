/*
 * /import/common/collections/organizations/fieldset.js
 *
 * The fields to be added to the Tenant's entity and to the Tenant's record.
 */

import { Forms } from 'meteor/pwix:forms';
import SimpleSchema from 'meteor/aldeed:simple-schema';

import { Jwks } from '/imports/common/tables/jwks/index.js';
import { Keygrips } from '/imports/common/tables/keygrips/index.js';

import { Organizations } from './index.js';

Organizations.entityFieldset = function(){
    return [
        {
            fields: [
                // a timestamp field which is updated when a correlated collection (identities, clients, ...) is itself updated
                // this way the DYN datas are too updated by the publication and they can be reactive in the UI
                {
                    name: 'witness_stamp',
                    type: Date,
                    optional: true
                }
            ]
        }
    ];
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
                    form_type: Forms.FieldType.C.MANDATORY
                },
                // -- providers
                // list of selected providers
                {
                    name: 'selectedProviders',
                    type: Array,
                    optional: true,
                    form_check: Organizations.checks.selectedProviders
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
                // -- oauth configuration
                // whether this organization wants *all* clients use PKCE (rfc7636)
                {
                    name: 'wantsPkce',
                    type: Boolean,
                    defaultValue: true,
                    form_check: Organizations.checks.wantsPkce,
                    form_type: Forms.FieldType.C.NONE
                },
                // -- identities configuration
                // whether the organization wants exactly/at least/at most 0..n email addresses for its identities
                {
                    name: 'identitiesEmailAddressesMinHow',
                    type: String,
                    defaultValue: 'exactly',
                    form_check: Organizations.checks.identitiesEmailAddressesMinHow,
                    form_type: Forms.FieldType.C.MANDATORY
                },
                {
                    name: 'identitiesEmailAddressesMinCount',
                    type: SimpleSchema.Integer,
                    defaultValue: 1,
                    form_check: Organizations.checks.identitiesEmailAddressesMinCount,
                    form_type: Forms.FieldType.C.MANDATORY
                },
                {
                    name: 'identitiesEmailAddressesMaxHow',
                    type: String,
                    defaultValue: 'nospec',
                    form_check: Organizations.checks.identitiesEmailAddressesMaxHow,
                    form_type: Forms.FieldType.C.MANDATORY
                },
                {
                    name: 'identitiesEmailAddressesMaxCount',
                    type: SimpleSchema.Integer,
                    defaultValue: 0,
                    form_check: Organizations.checks.identitiesEmailAddressesMaxCount,
                    form_type: Forms.FieldType.C.MANDATORY
                },
                {
                    name: 'identitiesEmailAddressesIdentifier',
                    type: Boolean,
                    defaultValue: true,
                    form_check: Organizations.checks.identitiesEmailAddressesIdentifier,
                    form_type: Forms.FieldType.C.NONE
                },
                // whether the organization wants exactly/at least/at most 0..n usernames for its identities
                {
                    name: 'identitiesUsernamesMinHow',
                    type: String,
                    defaultValue: 'least',
                    form_check: Organizations.checks.identitiesUsernamesMinHow,
                    form_type: Forms.FieldType.C.MANDATORY
                },
                {
                    name: 'identitiesUsernamesMinCount',
                    type: SimpleSchema.Integer,
                    defaultValue: 0,
                    form_check: Organizations.checks.identitiesUsernamesMinCount,
                    form_type: Forms.FieldType.C.MANDATORY
                },
                {
                    name: 'identitiesUsernamesMaxHow',
                    type: String,
                    defaultValue: 'nospec',
                    form_check: Organizations.checks.identitiesUsernamesMaxHow,
                    form_type: Forms.FieldType.C.MANDATORY
                },
                {
                    name: 'identitiesUsernamesMaxCount',
                    type: SimpleSchema.Integer,
                    defaultValue: 0,
                    form_check: Organizations.checks.identitiesUsernamesMaxCount,
                    form_type: Forms.FieldType.C.MANDATORY
                },
                {
                    name: 'identitiesUsernamesIdentifier',
                    type: Boolean,
                    defaultValue: false,
                    form_check: Organizations.checks.identitiesUsernamesIdentifier,
                    form_type: Forms.FieldType.C.NONE
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
                // array containing a list of the JSON Web Signature (JWS) signing algorithms ("alg" values) supported by the token endpoint
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
                // URL of the authorization server's OAuth 2.0 revocation endpoint
                {
                    name: 'revocation_endpoint',
                    type: String,
                    optional: true,
                    form_check: Organizations.checks.revocation_endpoint,
                    form_type: Forms.FieldType.C.OPTIONAL
                },
                // URL of the authorization server's OAuth 2.0 end_session endpoint
                {
                    name: 'end_session_endpoint',
                    type: String,
                    optional: true,
                    form_check: Organizations.checks.end_session_endpoint,
                    form_type: Forms.FieldType.C.OPTIONAL
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
                    optional: true,
                    form_check: Organizations.checks.introspection_endpoint,
                    form_type: Forms.FieldType.C.OPTIONAL
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
                // array containing a list of the signing algorithms ("alg" values) supported by request_object_signing (?)
                // found as an issuer metadata in openid-client doc
                // https://github.com/panva/node-openid-client/blob/main/docs/README.md#new-issuermetadata
                {
                    name: 'request_object_signing_alg_values_supported',
                    type: Array,
                    optional: true
                },
                {
                    name: 'request_object_signing_alg_values_supported.$',
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
                Jwks.recordFieldDef(),
                // -- Keygrips (used for cookies.keys)
                Keygrips.recordFieldDef(),
                // OpenID: userinfo
                {
                    name: 'userinfo_endpoint',
                    type: String,
                    optional: true,
                    form_check: Organizations.checks.userinfo_endpoint,
                    form_type: Forms.FieldType.C.OPTIONAL
                }
            ]
        }
    ];
};
