/*
 * /imports/common/collections/identities/fieldset.js
 */

import { Forms } from 'meteor/pwix:forms';

import { Identities } from './index.js';

Identities.fieldsDef = function(){
    let columns = [
        //  the organization entity identifier
        {
            name: 'organization',
            type: String,
            dt_tabular: false
        },
        // -- scope: profile
        // the user's full name
        {
            name: 'name',
            type: String,
            optional: true,
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
        // the preferred username that the user wishes to be referred to
        //  this is the 'id' identifier of the below username in the dedicated array
        {
            name: 'preferred_username',
            type: String,
            optional: true
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
            form_check: Identities.checks.zoneinfo,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        {
            name: 'locale',
            type: String,
            optional: true,
            dt_tabular: false,
            form_check: Identities.checks.locale,
            form_type: Forms.FieldType.C.OPTIONAL
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
            type: String
        },
        {
            name: 'addresses.$.label',
            type: String,
            optional: true
        },
        {
            name: 'addresses.$.address1',
            type: String,
            optional: true
        },
        {
            name: 'addresses.$.address2',
            type: String,
            optional: true
        },
        {
            name: 'addresses.$.address3',
            type: String,
            optional: true
        },
        {
            name: 'addresses.$.postalCode',
            type: String,
            optional: true
        },
        {
            name: 'addresses.$.region',
            type: String,
            optional: true
        },
        {
            name: 'addresses.$.locality',
            type: String,
            optional: true
        },
        {
            name: 'addresses.$.country',
            type: String,
            optional: true
        },
        {
            name: 'addresses.$.poNumber',
            type: String,
            optional: true
        },
        {
            name: 'addresses.$.preferred',
            type: Boolean,
            defaultValue: false
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
            type: String
        },
        {
            name: 'phones.$.label',
            type: String,
            optional: true
        },
        {
            name: 'phones.$.number',
            type: String
        },
        {
            name: 'phones.$.verified',
            type: Boolean,
            defaultValue: false
        },
        {
            name: 'phones.$.preferred',
            type: Boolean,
            defaultValue: false
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
            type: String
        },
        {
            name: 'usernames.$.label',
            type: String,
            optional: true
        },
        {
            name: 'usernames.$.username',
            type: String
        },
        {
            name: 'usernames.$.preferred',
            type: Boolean,
            defaultValue: false
        }
    ];
    return columns;
};
