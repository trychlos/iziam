/*
 * /imports/common/collections/identities/tabular.js
 *
 * This fieldset fully overrides the default tabular fieldset defined by AccountsManager.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import { Identities } from './index.js';

/**
 * @param {Object} organization the full organization entity with its DYN sub-object
 * @returns {Array<Object>} suitable as an input to Field.Set()
 */
Identities.tabularFieldsDef = function( organization ){
    let columns = [
        // -- scope: profile
        // the user's full name, either entered or computed
        // this is the default AccountsManager sort order - leave it as first column
        {
            name: 'tabular_name',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'identities.list.name_th' )
        },
        // the user's surname(s) or last name(s)
        {
            name: 'family_name',
            dt_visible: false
        },
        // the user's given name(s) or first name(s)
        {
            name: 'given_name',
            dt_visible: false
        },
        {
            name: 'middle_name',
            dt_visible: false
        },
        // the user's nick name that may or may not be the same as the given_name
        {
            name: 'nickname',
            dt_visible: false
        },
        // the URL of the user's profile page
        {
            name: 'profile_url',
            dt_visible: false
        },
        // the URL of the user's profile picture
        {
            name: 'picture_url',
            dt_visible: false
        },
        // the URL of the user's web page or blog
        {
            name: 'website_url',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'identities.list.website_th' )
        },
        {
            name: 'gender',
            dt_visible: false
        },
        // full birth date
        {
            name: 'birthdate',
            dt_visible: false
        },
        // only 'mm-dd' month-day
        {
            name: 'birthday',
            dt_visible: false
        },
        {
            name: 'zoneinfo',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'identities.list.zoneinfo_th' )
        },
        {
            name: 'locale',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'identities.list.locale_th' )
        },
        // a preferred email address
        {
            name: 'preferredEmailAddress',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'identities.list.email_th' )
        },
        {
            name: 'preferredEmailVerified',
            dt_visible: false
        },
        // a preferred username
        {
            name: 'preferredUsername',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'identities.list.username_th' )
        },
        //  the organization entity identifier
        {
            name: 'organization',
            dt_type: 'string',
            dt_visible: false
        },
        Timestampable.fieldDef(),
        {
            name: 'DYN',
            dt_visible: false
        }
    ];
    return columns;
};
