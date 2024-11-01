/*
 * /imports/client/components/organization_identities_groups_pane/organization_identities_groups_pane.js
 *
 * Display the groups.
 * 
 * +- <this>
 *     |
 *     +- identity_group_new_button
 *     |   |
 *     |   +-> trigger identity_group_edit_dialog
 *     |
 *     +- identities_groups_tree_view
 *         |
 *         +- groups_tree
 *         |
 *         +- groups_buttons
 *         |
 *         +-> trigger identities_groups_edit_dialog
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

import '/imports/client/components/identities_groups_tree_view/identities_groups_tree_view.js';
import '/imports/client/components/identity_group_new_button/identity_group_new_button.js';

import './organization_identities_groups_pane.html';

Template.organization_identities_groups_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    }
});
