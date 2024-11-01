/*
 * /imports/client/components/group_hierarchy_pane/group_hierarchy_pane.js
 *
 * Display the groups, letting one be selected.
 *
 * Parms:
 * - groups: the groups among them a selection must be set
 * - selectedRv: a ReactiveVar to get/set the current selection
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import '/imports/client/components/groups_tree/groups_tree.js';

import './group_hierarchy_pane.html';

Template.group_hierarchy_pane.helpers({
    parmsTree(){
        return {
            ...this,
            editable: false,
            withCheckboxes: false,
            selected: this.selectedRv.get(),
            noDataText: pwixI18n.label( I18N, 'groups.tree.no_data_two' )
        };
    }
});
