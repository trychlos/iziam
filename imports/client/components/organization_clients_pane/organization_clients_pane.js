/*
 * /imports/client/components/organization_clients_pane/organization_clients_pane.js
 *
 * Display the clients.
 * 
 * +- <this>
 *     |
 *     +- client_new_button
 *     |   |
 *     |   +-> trigger client_new_assistant
 *     |
 *     +- clients_list
 *         |
 *         +-> trigger client_edit_dialog
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

import '/imports/client/components/client_new_button/client_new_button.js';
import '/imports/client/components/clients_list/clients_list.js';

import './organization_clients_pane.html';

Template.organization_clients_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    }
});
