/*
 * /imports/common/collections/identities/tabular.js
 *
 * This fieldset fully overrides the default tabular fieldset defined by AccountsManager.
 */

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';

import { Identities } from './index.js';

/**
 * @param {Object} organization the full organization entity with its DYN sub-object
 * @returns {Array<Object>} suitable as an input to Field.Set()
 */
Identities.tabularFieldsDef = function( organization ){
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
            dt_visible: false
        },
        // the user's given name(s) or first name(s)
        {
            name: 'given_name',
            type: String,
            dt_visible: false
        },
        {
            name: 'middle_name',
            type: String,
            dt_visible: false
        },
        // the user's nick name that may or may not be the same as the given_name
        {
            name: 'nickname',
            type: String,
            dt_visible: false
        },
        // the URL of the user's profile page
        {
            name: 'profile_url',
            type: String,
            dt_visible: false
        },
        // the URL of the user's profile picture
        {
            name: 'picture_url',
            type: String,
            dt_visible: false
        },
        // the URL of the user's web page or blog
        {
            name: 'website_url',
            type: String,
            dt_title: pwixI18n.label( I18N, 'identities.list.website_th' )
        },
        {
            name: 'gender',
            type: String,
            dt_visible: false
        },
        // full birth date
        {
            name: 'birthdate',
            type: Date,
            dt_visible: false
        },
        // only 'mm-dd' month-day
        {
            name: 'birthday',
            type: String,
            dt_visible: false
        },
        {
            name: 'zoneinfo',
            type: String,
            dt_title: pwixI18n.label( I18N, 'identities.list.zoneinfo_th' )
        },
        {
            name: 'locale',
            type: String,
            dt_title: pwixI18n.label( I18N, 'identities.list.locale_th' )
        },
        // a preferred email address
        {
            name: 'preferredEmailAddress',
            type: String,
            dt_title: pwixI18n.label( I18N, 'identities.list.email_th' )
        },
        {
            name: 'preferredEmailVerified',
            type: Boolean,
            dt_visible: false
        },
        // a preferred username
        {
            name: 'preferredUsername',
            type: String,
            dt_title: pwixI18n.label( I18N, 'identities.list.username_th' )
        }
    ];
    return columns;
};
