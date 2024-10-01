/*
 * /imports/common/collections/identities/fieldset.js
 *
 * This fieldset fully overrides the default fieldset defined by AccountsManager.
 * This same fieldset is also used for the tabular display.
 * It includes both several optional email addresses and several optional usernames, so that all organizations options can be managed.
 */

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import SimpleSchema from 'meteor/aldeed:simple-schema';

import { Identities } from './index.js';

/**
 * @param {Object} organization the full organization entity with its DYN sub-object
 * @returns {Array<Object>} suitable as an input to Field.Set()
 */
Identities.fieldsDef = function( organization ){
    let columns = [
        //  the organization entity identifier
        {
            name: 'organization',
            type: String,
            dt_visible: false
        },
        // -- scope: profile
        // the user's full name
        {
            name: 'name',
            type: String,
            optional: true,
            dt_title: pwixI18n.label( I18N, 'identities.list.name_th' ),
            form_check: Identities.checks.name,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        // the user's surname(s) or last name(s)
        {
            name: 'family_name',
            type: String,
            optional: true,
            dt_tabular: false,
            form_check: Identities.checks.family_name,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        // the user's given name(s) or first name(s)
        {
            name: 'given_name',
            type: String,
            optional: true,
            dt_tabular: false,
            form_check: Identities.checks.given_name,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        {
            name: 'middle_name',
            type: String,
            optional: true,
            dt_tabular: false,
            form_check: Identities.checks.middle_name,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        // the user's nick name that may or may not be the same as the given_name
        {
            name: 'nickname',
            type: String,
            optional: true,
            dt_tabular: false,
            form_check: Identities.checks.nickname,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        // the URL of the user's profile page
        {
            name: 'profile_url',
            type: String,
            optional: true,
            dt_tabular: false,
            form_check: Identities.checks.profile_url,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        // the URL of the user's profile picture
        {
            name: 'picture_url',
            type: String,
            optional: true,
            dt_tabular: false,
            form_check: Identities.checks.picture_url,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        // the URL of the user's web page or blog
        {
            name: 'website_url',
            type: String,
            optional: true,
            dt_title: pwixI18n.label( I18N, 'identities.list.website_th' ),
            form_check: Identities.checks.website_url,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        {
            name: 'gender',
            type: String,
            optional: true,
            dt_tabular: false,
            form_check: Identities.checks.gender,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        // full birth date
        {
            name: 'birthdate',
            type: Date,
            optional: true,
            dt_tabular: false
        },
        // only 'mm-dd' month-day
        {
            name: 'birthday',
            type: String,
            optional: true,
            dt_tabular: false
        },
        {
            name: 'zoneinfo',
            type: String,
            optional: true,
            dt_title: pwixI18n.label( I18N, 'identities.list.zoneinfo_th' ),
            form_check: Identities.checks.zoneinfo,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        {
            name: 'locale',
            type: String,
            optional: true,
            dt_title: pwixI18n.label( I18N, 'identities.list.locale_th' ),
            form_check: Identities.checks.locale,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        // may host several email addresses
        {
            name: 'emails',
            type: Array,
            optional: true,
            dt_visible: false
        },
        {
            name: 'emails.$',
            type: Object,
            optional: true
        },
        {
            name: 'emails.$.id',
            type: String,
            dt_data: false,
            dt_visible: false
        },
        {
            name: 'emails.$.label',
            type: String,
            optional: true,
            dt_visible: false,
            form_check: Identities.checks.email_label,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        {
            name: 'emails.$.address',
            type: String,
            regEx: SimpleSchema.RegEx.Email,
            dt_data: false,
            dt_title: pwixI18n.label( I18N, 'list.email_address_th' ),
            dt_template: Meteor.isClient && Template.dt_email_address,
            form_check: Identities.checks.email_address,
            form_type: Forms.FieldType.C.MANDATORY
        },
        {
            name: 'emails.$.verified',
            type: Boolean,
            defaultValue: false,
            dt_data: false,
            dt_title: pwixI18n.label( I18N, 'list.email_verified_th' ),
            dt_template: Meteor.isClient && Template.dt_email_verified,
            form_check: Identities.checks.email_verified
        },
        {
            name: 'emails.$.preferred',
            type: Boolean,
            defaultValue: false,
            dt_tabular: false,
            form_check: Identities.checks.email_preferred
        },
        {
            dt_template: Meteor.isClient && Template.dt_email_more,
            dt_className: 'dt-center'
        },
        // -- scope: address
        //  adapted from https://schema.org/PostalAddress
        {
            name: 'addresses',
            type: Object,
            optional: true,
            dt_tabular: false
        },
        {
            name: 'addresses.$',
            type: Object
        },
        {
            name: 'addresses.$.id',
            type: String,
            dt_tabular: false
        },
        {
            name: 'addresses.$.label',
            type: String,
            optional: true,
            dt_tabular: false
        },
        {
            name: 'addresses.$.address1',
            type: String,
            optional: true,
            dt_tabular: false
        },
        {
            name: 'addresses.$.address2',
            type: String,
            optional: true,
            dt_tabular: false
        },
        {
            name: 'addresses.$.address3',
            type: String,
            optional: true,
            dt_tabular: false
        },
        {
            name: 'addresses.$.postalCode',
            type: String,
            optional: true,
            dt_tabular: false
        },
        {
            name: 'addresses.$.region',
            type: String,
            optional: true,
            dt_tabular: false
        },
        {
            name: 'addresses.$.locality',
            type: String,
            optional: true,
            dt_tabular: false
        },
        {
            name: 'addresses.$.country',
            type: String,
            optional: true,
            dt_tabular: false
        },
        {
            name: 'addresses.$.poNumber',
            type: String,
            optional: true,
            dt_tabular: false
        },
        {
            name: 'addresses.$.preferred',
            type: Boolean,
            defaultValue: false,
            dt_tabular: false
        },
        // -- scope: phone
        //  we do not require phone number unicity
        {
            name: 'phones',
            type: Array,
            optional: true,
            dt_tabular: false
        },
        {
            name: 'phones.$',
            type: Object
        },
        {
            name: 'phones.$.id',
            type: String,
            dt_tabular: false
        },
        {
            name: 'phones.$.label',
            type: String,
            optional: true,
            dt_tabular: false
        },
        {
            name: 'phones.$.number',
            type: String,
            dt_tabular: false
        },
        {
            name: 'phones.$.verified',
            type: Boolean,
            defaultValue: false,
            dt_tabular: false
        },
        {
            name: 'phones.$.preferred',
            type: Boolean,
            defaultValue: false,
            dt_tabular: false
        },
        // -- scope: username
        {
            name: 'usernames',
            type: Array,
            optional: true,
            dt_tabular: false
        },
        {
            name: 'usernames.$',
            type: Object
        },
        {
            name: 'usernames.$.id',
            type: String,
            dt_tabular: false
        },
        {
            name: 'usernames.$.label',
            type: String,
            optional: true,
            dt_tabular: false
        },
        {
            name: 'usernames.$.username',
            type: String,
            dt_tabular: false
        },
        {
            name: 'usernames.$.preferred',
            type: Boolean,
            defaultValue: false,
            dt_tabular: false
        }
    ];
    return columns;
};
