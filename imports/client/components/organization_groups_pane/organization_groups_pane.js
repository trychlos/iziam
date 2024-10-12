/*
 * /imports/client/components/organization_groups_pane/organization_groups_pane.js
 *
 * Display the groups.
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization as an entity with its DYN.records array
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - entityTabs
 * - recordTabs
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import '/imports/client/components/group_new_button/group_new_button.js';
import '/imports/client/components/groups_tree/groups_tree.js';

import './organization_groups_pane.html';

Template.organization_groups_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    }
});
