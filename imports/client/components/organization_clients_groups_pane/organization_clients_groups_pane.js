/*
 * /imports/client/components/organization_clients_groups_pane/organization_clients_groups_pane.js
 *
 * Display the groups.
 * 
 * +- <this>
 *     |
 *     +- group_new_button
 *     |   |
 *     |   +-> trigger group_edit_dialog
 *     |
 *     +- groups_panel
 *         |
 *         +- groups_tree
 *         |
 *         +- groups_buttons
 *         |
 *         +-> trigger groups_edit_dialog
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization as an entity with its DYN.records array
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - entityTabs
 * - recordTabs
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import '/imports/client/components/group_new_button/group_new_button.js';
import '/imports/client/components/groups_panel/groups_panel.js';

import './organization_clients_groups_pane.html';

Template.organization_clients_groups_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    }
});
