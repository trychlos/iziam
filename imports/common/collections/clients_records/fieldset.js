/*
 * /imports/common/collections/clients_records/fieldset.js
 *
 * The clients registered with an organization.
 *
 * See https://datatracker.ietf.org/doc/html/rfc7591#section-2 Client Metadata
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Field } from 'meteor/pwix:field';
import { Notes } from 'meteor/pwix:notes';
import { pwixI18n } from 'meteor/pwix:i18n';
import SimpleSchema from 'meteor/aldeed:simple-schema';
import { Tracker } from 'meteor/tracker';
import { Validity } from 'meteor/pwix:validity';

import { ClientSecrets } from '/imports/common/tables/client_secrets/index.js';
import { Jwks } from '/imports/common/tables/jwks/index.js';

import { ClientsRecords } from './index.js';

const _defaultFieldDef = function(){
    let columns = [
        // -- properties
        // the client displayed name, mandatory, unique
        // this is the 'client_name' OAuth 2 client metadata
        {
            name: 'label',
            type: String,
            form_check: ClientsRecords.checks.label,
            form_type: Forms.FieldType.C.MANDATORY,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.client_name' )
        },
        // a not too long description (not a note)
        {
            name: 'description',
            type: String,
            optional: true,
            form_check: ClientsRecords.checks.description,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        // a not too long description (not a note)
        {
            name: 'author',
            type: String,
            optional: true,
            form_check: ClientsRecords.checks.author,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        // whether the client is enabled ?
        {
            name: 'enabled',
            type: Boolean,
            defaultValue: true,
            form_check: ClientsRecords.checks.enabled,
            form_type: Forms.FieldType.C.NONE
        },
        // -- profile
        // the client chosen profile from ClientProfile which helps to determine other parameters
        {
            name: 'profile',
            type: String,
            optional: true,
            form_check: ClientsRecords.checks.profile,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        // the client type in the OAuth 2 sense (https://datatracker.ietf.org/doc/html/rfc6749#section-2)
        //  confidential or public
        {
            name: 'client_type',
            type: String,
            optional: true,
            form_check: ClientsRecords.checks.client_type,
            form_type: Forms.FieldType.C.MANDATORY,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.client_type' )
        },
        // --
        // list of selected providers
        // pwi 2024-09-12 the client no more select its providers; instead, it chooses its grant type, and it is
        //  up to the authorization server to find the ad-hoc provider
        //  see Clients.fn.hasSelectedProviders() function to hard code this design decision
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
        // -- OAuth 2.0 Client Metadata
        // https://datatracker.ietf.org/doc/html/rfc7591#section-2
        // redirect uris - their presence depends of the chosen grant flow
        {
            name: 'redirect_uris',
            type: Array,
            optional: true,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.redirect_uris' )
        },
        {
            name: 'redirect_uris.$',
            type: Object
        },
        {
            name: 'redirect_uris.$.uri',
            type: String,
            form_check: ClientsRecords.checks.redirect_uri
        },
        {
            name: 'redirect_uris.$._id',
            type: String
        },
        // the authentification method against the token endpoint
        {
            name: 'token_endpoint_auth_method',
            type: String,
            optional: true,
            form_check: ClientsRecords.checks.token_endpoint_auth_method,
            form_type: Forms.FieldType.C.OPTIONAL,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.token_endpoint_auth_method' )
        },
        // selected grant types that the client can use against token endpoint
        {
            name: 'grant_types',
            type: Array,
            optional: true,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.grant_types' )
        },
        {
            name: 'grant_types.$',
            type: String
        },
        // optional token extensions
        {
            name: 'token_extensions',
            type: Array,
            optional: true
        },
        {
            name: 'token_extensions.$',
            type: String
        },
        /*
        // the OAuth 2.0 response type strings that the client can use against authorization endpoint
        {
            name: 'response_types',
            type: Array,
            optional: true,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.response_types' )
        },
        {
            name: 'response_types.$',
            type: String
        },
        */
        // the client home page (if applyable)
        {
            name: 'client_uri',
            type: String,
            optional: true,
            form_check: ClientsRecords.checks.client_uri,
            form_type: Forms.FieldType.C.OPTIONAL,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.client_uri' )
        },
        // the client logo (displayable to the end user)
        {
            name: 'logo_uri',
            type: String,
            optional: true,
            form_check: ClientsRecords.checks.logo_uri,
            form_type: Forms.FieldType.C.OPTIONAL,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.logo_uri' )
        },
        /*
        // the scope values that the client may use when requesting access tokens
        // OAuth 2 defines that as a single space-separated string said 'scope'
        {
            name: 'scopes',
            type: Array,
            optional: true,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.scopes' )
        },
        {
            name: 'scopes.$',
            type: String
        },
        */
        // the contacts as ways to contact people responsible for this client
        {
            name: 'contacts',
            type: Array,
            optional: true,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.contacts' )
        },
        {
            name: 'contacts.$',
            type: Object
        },
        {
            name: 'contacts.$.email',
            type: String,
            form_check: ClientsRecords.checks.contact_email
        },
        {
            name: 'contacts.$._id',
            type: String
        },
        // the client terms of service
        {
            name: 'tos_uri',
            type: String,
            optional: true,
            form_check: ClientsRecords.checks.tos_uri,
            form_type: Forms.FieldType.C.OPTIONAL,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.tos_uri' )
        },
        // privacy policy
        {
            name: 'policy_uri',
            type: String,
            optional: true,
            form_check: ClientsRecords.checks.policy_uri,
            form_type: Forms.FieldType.C.OPTIONAL,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.policy_uri' )
        },
        // JWKS document uri - the document which contains the client's public keys
        // if jwks_uri is set, then we use this value
        //  else we publish the jwks array if it exists
        //  exclusive from jwks
        /*
        {
            name: 'jwks_uri',
            type: String,
            optional: true,
            //form_check: ClientsRecords.checks.policy_uri,
            form_type: Forms.FieldType.C.OPTIONAL,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.jwks_uri' )
        },
        */
        // JWKS JSON object which contains the client's public keys
        //  exclusive from jwks_uri
        Jwks.recordFieldDef(),
        // an identifier string of a software client (profile 'm-to-m') - in other words, how the client identifies itself
        {
            name: 'software_id',
            type: String,
            optional: true,
            form_check: ClientsRecords.checks.software_id,
            form_type: Forms.FieldType.C.OPTIONAL,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.software_id' )
        },
        // a qualifier string for the client - this may let it distinguish between several registration instances
        {
            name: 'software_version',
            type: String,
            optional: true,
            form_check: ClientsRecords.checks.software_version,
            form_type: Forms.FieldType.C.OPTIONAL,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.software_version' )
        },
        // -- OpenID Connect Dynamic Client Registration
        // https://openid.net/specs/openid-connect-registration-1_0.html#ClientMetadata
        // kind of the application, native or web
        {
            name: 'application_type',
            type: String,
            optional: true,
            form_check: ClientsRecords.checks.application_type,
            form_type: Forms.FieldType.C.OPTIONAL,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.application_type' )
        },
        /*
        // to be used in calculating Pseudonymous Identifiers
        {
            name: 'sector_identifier_uri',
            type: String,
            optional: true,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.sector_identifier_uri' )
        },
        // requested for responses to this Client
        {
            name: 'subject_type',
            type: String,
            optional: true,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.subject_type' )
        },
        // JWS alg algorithm [JWA] REQUIRED for signing the ID Token issued to this Client
        {
            name: 'id_token_signed_response_alg',
            type: String,
            optional: true,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.id_token_signed_response_alg' )
        },
        // JWE alg algorithm [JWA] REQUIRED for encrypting the ID Token issued to this Client
        {
            name: 'id_token_encrypted_response_alg',
            type: String,
            optional: true,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.id_token_encrypted_response_alg' )
        },
        // JWE enc algorithm [JWA] REQUIRED for encrypting the ID Token issued to this Client
        {
            name: 'id_token_encrypted_response_enc',
            type: String,
            optional: true,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.id_token_encrypted_response_enc' )
        },
        // JWS alg algorithm [JWA] REQUIRED for signing UserInfo Responses
        {
            name: 'userinfo_signed_response_alg',
            type: String,
            optional: true,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.userinfo_signed_response_alg' )
        },
        // JWE [JWE] alg algorithm [JWA] REQUIRED for encrypting UserInfo Responses
        {
            name: 'userinfo_encrypted_response_alg',
            type: String,
            optional: true,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.userinfo_encrypted_response_alg' )
        },
        // JWS [JWS] alg algorithm [JWA] that MUST be used for signing Request Objects sent to the OP
        {
            name: 'request_object_signing_alg',
            type: String,
            optional: true,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.request_object_signing_alg' )
        },
        // JWE [JWE] alg algorithm [JWA] the RP is declaring that it may use for encrypting Request Objects sent to the OP
        {
            name: 'request_object_encryption_alg',
            type: String,
            optional: true,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.request_object_encryption_alg' )
        },
        // JWE enc algorithm [JWA] the RP is declaring that it may use for encrypting Request Objects sent to the OP
        {
            name: 'request_object_encryption_enc',
            type: String,
            optional: true,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.request_object_encryption_enc' )
        },
        // JWS [JWS] alg algorithm [JWA] that MUST be used for signing the JWT [JWT] used to authenticate the
        // Client at the Token Endpoint for the private_key_jwt and client_secret_jwt authentication methods
        {
            name: 'token_endpoint_auth_signing_alg',
            type: String,
            optional: true,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.token_endpoint_auth_signing_alg' )
        },
        // Default Maximum Authentication Age
        {
            name: 'default_max_age',
            type: SimpleSchema.Integer,
            optional: true,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.default_max_age' )
        },
        // Boolean value specifying whether the auth_time Claim in the ID Token is REQUIRED
        {
            name: 'require_auth_time',
            type: Boolean,
            optional: true,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.require_auth_time' )
        },
        // Default requested Authentication Context Class Reference values
        {
            name: 'default_acr_values',
            type: Array,
            optional: true,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.default_acr_values' )
        },
        {
            name: 'default_acr_values.$',
            type: String
        },
        // URI using the https scheme that a third party can use to initiate a login by the RP
        {
            name: 'initiate_login_uri',
            type: String,
            optional: true,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.initiate_login_uri' )
        },
        // Array of request_uri values that are pre-registered by the RP for use at the OP
        {
            name: 'request_uris',
            type: Array,
            optional: true,
            help_tooltip: pwixI18n.label( I18N, 'clients.metadata.request_uris' )
        },
        {
            name: 'request_uris.$',
            type: Object
        },
        {
            name: 'request_uris.$.uri',
            type: String
        },
        {
            name: 'request_uris.$.id',
            type: String
        },
        // post_logout_redirect_uris (yes this is an array according to node-oidc-provider)
        */
        // whether the client wants authenticated identities
        {
            name: 'identity_auth_mode',
            type: String,
            defaultValue: 'auth',
            form_check: ClientsRecords.checks.identity_auth_mode,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        // how the client does accept new identities
        {
            name: 'identity_access_mode',
            type: String,
            defaultValue: 'auth',
            form_check: ClientsRecords.checks.identity_access_mode,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        // client secrets
        ClientSecrets.recordFieldDef(),
        // --
        Notes.fieldDef(),
        Validity.recordsFieldDef(),
        Timestampable.fieldDef()
    ];
    return columns;
};

Tracker.autorun(() => {
    let columns = _defaultFieldDef();
    let fieldset = new Field.Set( columns );
    ClientsRecords.fieldSet.set( fieldset );
});
