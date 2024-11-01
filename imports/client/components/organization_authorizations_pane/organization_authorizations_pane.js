/*
 * /imports/client/components/organization_authorizations_pane/organization_authorizations_pane.js
 *
 * Display the authorizations.
 * 
 * +- <this>
 *     |
 *     +- authorization_new_button
 *     |   |
 *     |   +-> trigger authorization_edit_dialog
 *     |
 *     +- authorizations_list
 *         |
 *         +-> trigger authorization_edit_dialog
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization as an entity with its DYN.records array
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - entityTabs
 * - recordTabs
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import '/imports/client/components/authorization_new_button/authorization_new_button.js';
import '/imports/client/components/authorizations_list/authorizations_list.js';

import './organization_authorizations_pane.html';

Template.organization_authorizations_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    }
});
