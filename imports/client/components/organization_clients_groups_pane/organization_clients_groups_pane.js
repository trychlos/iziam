/*
 * /imports/client/components/organization_clients_groups_pane/organization_clients_groups_pane.js
 *
 * Display the groups.
 * 
 * +- <this>
 *     |
 *     +- client_group_new_button
 *     |   |
 *     |   +-> trigger client_group_edit_dialog
 *     |
 *     +- clients_groups_tree_view
 *         |
 *         +- groups_tree
 *         |
 *         +- groups_buttons
 *         |
 *         +-> trigger clients_groups_edit_dialog
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

import '/imports/client/components/client_group_new_button/client_group_new_button.js';
import '/imports/client/components/clients_groups_tree_view/clients_groups_tree_view.js';

import './organization_clients_groups_pane.html';

Template.organization_clients_groups_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    }
});
