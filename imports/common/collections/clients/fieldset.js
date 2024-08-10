/*
 * /imports/collections/clients/clients-schema.js
 * The clients registered with an organization.
 */

import SimpleSchema from 'simpl-schema';

Clients.schema = new SimpleSchema({
    //  the organization entity
    organization: {
        type: String
    },
    // the client entity
    entity: {
        type: String
    },
    // the client displayed name
    label: {
        type: String
    },
    // the client nature from ClientNature
    nature: {
        type: String,
        defaultValue: 'public'
    },
    // the client type in the OAuth 2.0 sense (https://datatracker.ietf.org/doc/html/rfc6749#section-2)
    //  confidential or public
    type: {
        type: String,
        defaultValue: 'public'
    },
    // how the client has it been registered ?
    //  pre-registered or dynamic
    registration: {
        type: String
    },
    // a description of the client (which are not notes)
    description: {
        type: String,
        optional: true
    },
    // authorization grant types that the client can use at the token endpoint.
    grantTypes: {
        type: Array,
        optional: true
    },
    'grantTypes.$': {
        type: String,
    },
    // token endpoint authentification method
    //  one among those available from the autorization server
    authMethod: {
        type: String,
        defaultValue: 'none'
    },
    // client contact email addresses - at least one is mandatory unless in the UI
    contacts: {
        type: Array,
        optional: true
    },
    'contacts.$': {
        type: String
    },
    // client redirect endpoints - at least one is mandatory (unless in the UI)
    endpoints: {
        type: Array,
        optional: true
    },
    'endpoints.$': {
        type: String
    },
    // client identifier as provided by the authorization server - not a secret
    clientId: {
        type: String,
        optional: true
    },
    // client secret
    //  NOTE: oidc-provider needs the clear secret to handle the client authentification - so keep it here
    clientSecrets: {
        type: Array,
        optional: true
    },
    'clientSecrets.$': {
        type: Object
    },
    'clientSecrets.$.id': {     // the UI needs an identifier for each item
        type: String
    },
    'clientSecrets.$.hash': {
        type: String
    },
    'clientSecrets.$.secret': {
        type: String
    },
    'clientSecrets.$.createdAt': {
        type: Date
    },
    'clientSecrets.$.createdBy': {
        type: String
    },
    // client's JSON Web Key Url - if set, must point to a valid JWK Set document
    jwksUri: {
        type: String,
        optional: true
    },
    // client's JSON Web Key Set - if set, must be a valid JWK Set document
    jwksSet: {
        type: String,
        optional: true
    },
    // An identifier string auto-assigned by the dynamically registered client - in other words, how the client identifies itself
    softwareId: {
        type: String,
        optional: true
    },
    // A qualifier string auto-assigned by the dynamically registered client which let it distinguish between several registration instances
    softwareVersion: {
        type: String,
        optional: true
    },
    // the response types that the client can use
    responseTypes: {
        type: Array,
        optional: true
    },
    'responseTypes.$': {
        type: String,
    },
    // whether this client is enabled
    enabled: {
        type: Boolean,
        defaultValue: true
    },
    // Mongo identifier
    // mandatory (auto by Meteor+Mongo)
    _id: {
        type: String,
        optional: true
    }
});

Clients.attachBehaviour( 'timestampable' );

Clients.schema.extend( Meteor.APP.ExtNotes.schema );
Clients.schema.extend( Meteor.APP.ExtPublisher.schema );
Clients.schema.extend( Meteor.APP.Validity.schema );
Clients.attachSchema( Clients.schema );
