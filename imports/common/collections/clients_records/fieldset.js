/*
 * /imports/collections/clients_records/fieldset.js
 *
 * The clients registered with an organization.
 */

import { Field } from 'meteor/pwix:field';
import { Notes } from 'meteor/pwix:notes';
import { pwixI18n } from 'meteor/pwix:i18n';
import { Tracker } from 'meteor/tracker';
import { Validity } from 'meteor/pwix:validity';

import { Clients } from '/imports/common/collections/clients/index.js';

import { ClientsRecords } from './index.js';

const _defaultFieldSet = function(){
    let columns = [
        // -- properties
        // the client displayed name, mandatory, unique
        {
            name: 'label',
            type: String,
            form_check: Clients.checks.label,
            form_type: Forms.FieldType.C.MANDATORY
        },
        // a not too long description (not a note)
        {
            name: 'description',
            type: String,
            optional: true,
            form_check: Clients.checks.description,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        // an identifier string of a software client (profile 'm-to-m') - in other words, how the client identifies itself
        {
            name: 'softwareId',
            type: String,
            optional: true,
            form_check: Clients.checks.softwareId,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        // a qualifier string for the client - this may let it distinguish between several registration instances
        {
            name: 'softwareVersion',
            type: String,
            optional: true,
            form_check: Clients.checks.softwareVersion,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        // -- profile
        // the client chosen profile from ClientProfile which helps to determine the client type
        // a client-new-assistant data
        {
            name: 'profile',
            type: String,
            form_check: Clients.checks.profile,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        // the client type in the OAuth 2 sense (https://datatracker.ietf.org/doc/html/rfc6749#section-2)
        //  confidential or public
        {
            name: 'clientType',
            type: String,
            form_check: Clients.checks.clientType,
            form_type: Forms.FieldType.C.MANDATORY
        },
        // --
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
        // --
        // selected grant types that the client can use against authorization and token endpoints
        {
            name: 'grantTypes',
            type: Array,
            optional: true
        },
        {
            name: 'grantTypes.$',
            type: String,
        },
        // --
        // redirect urls - at least one is required (unless in the UI)
        {
            name: 'redirectUrls',
            type: Array,
            optional: true
        },
        {
            name: 'redirectUrls.$',
            type: Object
        },
        {
            name: 'redirectUrls.$.url',
            type: String,
            form_check: Clients.checks.redirectUrl
        },
        {
            name: 'redirectUrls.$.id',
            type: String
        },
        Notes.fieldDef(),
        Validity.recordsFieldDef(),
        Timestampable.fieldDef()
    ];
    return columns;
};

Tracker.autorun(() => {
    let columns = _defaultFieldSet();
    let fieldset = new Field.Set( columns );
    ClientsRecords.fieldSet.set( fieldset );
});
