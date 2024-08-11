/*
 * /imports/collections/clients_records/fieldset.js
 *
 * The clients registered with an organization.
 */

import SimpleSchema from 'simpl-schema';

import { Field } from 'meteor/pwix:field';
import { Notes } from 'meteor/pwix:notes';
import { pwixI18n } from 'meteor/pwix:i18n';
import { Tracker } from 'meteor/tracker';
import { Validity } from 'meteor/pwix:validity';

import { Tenants } from './index.js';

const _defaultFieldSet = function(){
    let columns = [
        // the organization entity
        // mandatory
        {
            name: 'organization',
            type: String,
            dt_title: pwixI18n.label( I18N, 'clients.list.organization_th' )
        },
        // the client entity
        // mandatory
        {
            name: 'organization',
            type: String,
            dt_title: pwixI18n.label( I18N, 'clients.list.organization_th' )
        },
        // entity notes in tabular display
        {
            name: 'entity_notes',
            schema: false,
            dt_title: pwixI18n.label( I18N, 'list.entity_notes_th' ),
            dt_className: 'dt-center',
            dt_template: Meteor.isClient && Template.dt_entity_notes
        },
        // personal data management policy page
        {
            name: 'pdmpUrl',
            schema: false,
            dt_visible: false
        },
        // general terms of use
        {
            name: 'gtuUrl',
            schema: false,
            dt_visible: false
        },
        // legals terms page
        {
            name: 'legalsUrl',
            schema: false,
            dt_visible: false
        },
        // a page which describes the organization
        {
            name: 'homeUrl',
            schema: false,
            dt_title: pwixI18n.label( I18N, 'list.home_page_th' )
        },
        // a page to access the support
        {
            name: 'supportUrl',
            schema: false,
            dt_visible: false
        },
        // a contact page
        {
            name: 'contactUrl',
            schema: false,
            dt_title: pwixI18n.label( I18N, 'list.contact_page_th' )
        },
        // the organization logo (either an Url or an embedded image, or both)
        {
            name: 'logoUrl',
            schema: false,
            dt_visible: false
        },
        {
            name: 'logoImage',
            schema: false,
            dt_visible: false
        },
        // support email address
        {
            name: 'supportEmail',
            schema: false,
            dt_visible: false
        },
        // contact email address
        {
            name: 'contactEmail',
            schema: false,
            dt_title: pwixI18n.label( I18N, 'list.contact_email_th' )
        },
        Notes.fieldDef(),
        Validity.recordsFieldDef(),
        Timestampable.fieldDef(),
        {
            name: 'DYN',
            dt_visible: false
        }
    ];
    return columns;
};

Tracker.autorun(() => {
    const conf = TenantsManager.configure();
    let columns = _defaultFieldSet( conf );
    let fieldset = new Field.Set( columns );
    // add application-configured fieldset if any
    if( conf.tenantFields ){
        fieldset.extend( conf.tenantFields );
    }
    // update the fieldSet definitions to display start and end effect dates
    let def = fieldset.byName( 'effectStart' );
    if( def ){
        def.set({
            dt_visible: true,
            dt_title: pwixI18n.label( I18N, 'list.effect_start_th' ),
            dt_templateContext( rowData ){
                return {
                    date: rowData.effectStart
                };
            }
        });
    }
    def = fieldset.byName( 'effectEnd' );
    if( def ){
        def.set({
            dt_visible: true,
            dt_title: pwixI18n.label( I18N, 'list.effect_end_th' ),
            dt_templateContext( rowData ){
                return {
                    date: rowData.effectEnd
                };
            }
        });
    }
    Tenants.fieldSet.set( fieldset );
});


Clients.schema = new SimpleSchema({
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
