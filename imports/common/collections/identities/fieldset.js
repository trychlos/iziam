/*
 * /imports/common/collections/identities/fieldset.js
 *
 * This fieldset fully overrides the default fieldset defined by AccountsManager.
 * It includes both several optional email addresses and several optional usernames, so that all organizations options can be managed.
 * A dedicated tabular fieldset is also provided.
 * 
 * OpenID Identities claims are defined heren, under an 'oid' key:
 * - name: defaults to name
 * - use: defaults to all
 * - fn: when the value must be computed
 * - scopes: the list of the scopes which include this claim
 */

import strftime from 'strftime';

import { Forms } from 'meteor/pwix:forms';
import SimpleSchema from 'meteor/aldeed:simple-schema';

import { Identities } from './index.js';

/**
 * @returns {Array<Object>} suitable as an input to Field.Set()
 *  NB: cannot depend of the organization as this is also used to register identity scopes
 */
Identities.fieldsDef = function(){
    let columns = [
        //  the organization entity identifier
        {
            name: 'organization',
            type: String,
            oid: {
                name: 'tid',
                scopes: [
                    'openid'
                ]
            }
        },
        // -- scope: profile
        // the user's full name
        {
            name: 'name',
            type: String,
            optional: true,
            form_check: Identities.checks.name,
            form_type: Forms.FieldType.C.OPTIONAL,
            oid: {
                scopes: [
                    'profile'
                ],
                use: [
                    'userinfo'
                ]
            }
        },
        // the user's surname(s) or last name(s)
        {
            name: 'family_name',
            type: String,
            optional: true,
            form_check: Identities.checks.family_name,
            form_type: Forms.FieldType.C.OPTIONAL,
            oid: {
                scopes: [
                    'profile'
                ],
                use: [
                    'userinfo'
                ]
            }
        },
        // the user's given name(s) or first name(s)
        {
            name: 'given_name',
            type: String,
            optional: true,
            form_check: Identities.checks.given_name,
            form_type: Forms.FieldType.C.OPTIONAL,
            oid: {
                scopes: [
                    'profile'
                ],
                use: [
                    'userinfo'
                ]
            }
        },
        {
            name: 'middle_name',
            type: String,
            optional: true,
            form_check: Identities.checks.middle_name,
            form_type: Forms.FieldType.C.OPTIONAL,
            oid: {
                scopes: [
                    'profile'
                ],
                use: [
                    'userinfo'
                ]
            }
        },
        // the best label for the identity
        {
            schema: false,
            tabular: false,
            form: false,
            oid: {
                name: Meteor.APP.C.oidcUrn+'identity:claim:best_label',
                async fn( identity ){
                    return await Identities.fn.bestLabel( identity );
                },
                scopes: [
                    Meteor.APP.C.oidcUrn+'identity:scope:profile'
                ]
            }
        },
        // the user's nick name that may or may not be the same as the given_name
        {
            name: 'nickname',
            type: String,
            optional: true,
            form_check: Identities.checks.nickname,
            form_type: Forms.FieldType.C.OPTIONAL,
            oid: {
                scopes: [
                    'profile'
                ]
            }
        },
        // the URL of the user's profile page
        {
            name: 'profile_url',
            type: String,
            optional: true,
            form_check: Identities.checks.profile_url,
            form_type: Forms.FieldType.C.OPTIONAL,
            oid: {
                name: 'profile',
                scopes: [
                    'profile'
                ],
                use: [
                    'userinfo'
                ]
            }
        },
        // the URL of the user's profile picture
        {
            name: 'picture_url',
            type: String,
            optional: true,
            form_check: Identities.checks.picture_url,
            form_type: Forms.FieldType.C.OPTIONAL,
            oid: {
                name: 'picture',
                scopes: [
                    'profile'
                ],
                use: [
                    'userinfo'
                ]
            }
        },
        // the URL of the user's web page or blog
        {
            name: 'website_url',
            type: String,
            optional: true,
            form_check: Identities.checks.website_url,
            form_type: Forms.FieldType.C.OPTIONAL,
            oid: {
                name: 'website',
                scopes: [
                    'profile'
                ],
                use: [
                    'userinfo'
                ]
            }
        },
        {
            name: 'gender',
            type: String,
            optional: true,
            form_check: Identities.checks.gender,
            form_type: Forms.FieldType.C.OPTIONAL,
            oid: {
                scopes: [
                    'profile'
                ],
                use: [
                    'userinfo'
                ]
            }
        },
        // full birth date
        {
            name: 'birthdate',
            type: Date,
            optional: true,
            form_check: Identities.checks.birthdate,
            form_type: Forms.FieldType.C.OPTIONAL,
            oid: {
                scopes: [
                    'profile'
                ],
                use: [
                    'userinfo'
                ]
            }
        },
        // only 'mm-dd' month-day
        {
            name: 'birthday',
            type: String,
            optional: true,
            form_check: Identities.checks.birthday,
            form_type: Forms.FieldType.C.OPTIONAL,
            oid: {
                name: Meteor.APP.C.oidcUrn+'identity:claim:birthday',
                async fn( identity ){
                    return strftime( '%Y-%m-%d %H:%M:%S', identity.birthday );
                },
                scopes: [
                    Meteor.APP.C.oidcUrn+'identity:scope:profile'
                ]
            }
        },
        {
            name: 'zoneinfo',
            type: String,
            optional: true,
            form_check: Identities.checks.zoneinfo,
            form_type: Forms.FieldType.C.OPTIONAL,
            oid: {
                scopes: [
                    'profile'
                ]
            }
        },
        {
            name: 'locale',
            type: String,
            optional: true,
            form_check: Identities.checks.locale,
            form_type: Forms.FieldType.C.OPTIONAL,
            oid: {
                scopes: [
                    'profile'
                ],
                use: [
                    'userinfo'
                ]
            }
        },
        // may host several email addresses
        {
            name: 'emails',
            type: Array,
            optional: true
        },
        {
            name: 'emails.$',
            type: Object,
            optional: true
        },
        {
            name: 'emails.$._id',
            type: String
        },
        {
            name: 'emails.$.label',
            type: String,
            optional: true,
            form_check: Identities.checks.email_label,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        {
            name: 'emails.$.address',
            type: String,
            regEx: SimpleSchema.RegEx.Email,
            form_check: Identities.checks.email_address,
            form_type: Forms.FieldType.C.MANDATORY
        },
        {
            name: 'emails.$.verified',
            type: Boolean,
            defaultValue: false,
            form_check: Identities.checks.email_verified
        },
        {
            name: 'emails.$.preferred',
            type: Boolean,
            defaultValue: false,
            form_check: Identities.checks.email_preferred
        },
        // the preferred email address for the identity (computed)
        {
            schema: false,
            tabular: false,
            form: false,
            oid: {
                name: 'email',
                async fn( identity ){
                    return await Identities.fn.emailPreferred( identity )?.address;
                },
                scopes: [
                    'email'
                ]
            }
        },
        {
            schema: false,
            tabular: false,
            form: false,
            oid: {
                name: 'email_verified',
                async fn( identity ){
                    return await Identities.fn.emailPreferred( identity )?.verified;
                },
                scopes: [
                    'email'
                ]
            }
        },
        // -- scope: address
        //  adapted from https://schema.org/PostalAddress
        {
            name: 'addresses',
            type: Array,
            optional: true
        },
        {
            name: 'addresses.$',
            type: Object
        },
        {
            name: 'addresses.$._id',
            type: String
        },
        {
            name: 'addresses.$.label',
            type: String,
            optional: true,
            form_check: Identities.checks.address_label,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        {
            name: 'addresses.$.line1',
            type: String,
            optional: true,
            form_check: Identities.checks.address_line1,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        {
            name: 'addresses.$.line2',
            type: String,
            optional: true,
            form_check: Identities.checks.address_line2,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        {
            name: 'addresses.$.line3',
            type: String,
            optional: true,
            form_check: Identities.checks.address_line3,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        {
            name: 'addresses.$.postalCode',
            type: String,
            optional: true,
            form_check: Identities.checks.address_postal_code,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        {
            name: 'addresses.$.region',
            type: String,
            optional: true,
            form_check: Identities.checks.address_region,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        {
            name: 'addresses.$.locality',
            type: String,
            optional: true,
            form_check: Identities.checks.address_locality,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        {
            name: 'addresses.$.country',
            type: String,
            optional: true,
            form_check: Identities.checks.address_country,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        {
            name: 'addresses.$.poNumber',
            type: String,
            optional: true,
            form_check: Identities.checks.address_po_number,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        {
            name: 'addresses.$.preferred',
            type: Boolean,
            defaultValue: false,
            form_check: Identities.checks.address_preferred,
        },
        // -- scope: phone
        //  we do not require phone number unicity
        {
            name: 'phones',
            type: Array,
            optional: true
        },
        {
            name: 'phones.$',
            type: Object
        },
        {
            name: 'phones.$._id',
            type: String
        },
        {
            name: 'phones.$.label',
            type: String,
            optional: true,
            form_check: Identities.checks.phone_label,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        {
            name: 'phones.$.number',
            type: String,
            form_check: Identities.checks.phone_number,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        {
            name: 'phones.$.verified',
            type: Boolean,
            defaultValue: false,
            form_check: Identities.checks.phone_verified
        },
        {
            name: 'phones.$.preferred',
            type: Boolean,
            defaultValue: false,
            form_check: Identities.checks.phone_preferred
        },
        // -- scope: username
        {
            name: 'usernames',
            type: Array,
            optional: true
        },
        {
            name: 'usernames.$',
            type: Object
        },
        {
            name: 'usernames.$._id',
            type: String
        },
        {
            name: 'usernames.$.label',
            type: String,
            optional: true,
            form_check: Identities.checks.username_label,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        {
            name: 'usernames.$.username',
            type: String,
            form_check: Identities.checks.username_username,
            form_type: Forms.FieldType.C.MANDATORY
        },
        {
            name: 'usernames.$.preferred',
            type: Boolean,
            defaultValue: false,
            form_check: Identities.checks.username_preferred
        },
        // the preferred username for the identity (computed)
        {
            schema: false,
            tabular: false,
            form: false,
            oid: {
                name: 'preferred_username',
                async fn( identity ){
                    return await Identities.fn.usernamePreferred( identity )?.username;
                },
                scopes: [
                    'profile'
                ],
                use: [
                    'userinfo'
                ]
            }
        },
        {
            schema: false,
            tabular: false,
            form: false,
            oid: {
                name: 'updated_at',
                fn( identity ){
                    return strftime( '%Y-%m-%d %H:%M:%S', identity.updatedAt || identity.createdAt );
                },
                scopes: [
                    'profile'
                ]
            }
        }
    ];
    return columns;
};
