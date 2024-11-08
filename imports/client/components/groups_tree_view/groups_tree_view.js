/*
 * /imports/group/components/groups_tree_view/groups_tree_view.js
 *
 * Display the groups tree as a read-only component, and an 'edit' button.
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization as an entity with its DYN.records array
 * - checker: a ReactiveVar which contains the parent Forms.Checker,
 * - treeName: an optional name to be displayed in debug messages
 * - groupsRv: a ReactiveVar which contains the groups of the organization
 * - groupsDef: the definition of the target groups type
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Modal } from 'meteor/pwix:modal';

import '/imports/client/components/groups_buttons/groups_buttons.js';
import '/imports/client/components/groups_tree/groups_tree.js';

import './groups_tree_view.html';

Template.groups_tree_view.helpers({
    parmsButtons(){
        return {
            item: this.item,
            checker: this.checker,
            editable: false
        };
    },
    parmsTree(){
        return {
            item: this.item,
            checker: this.checker,
            treeName: this.treeName,
            groupsRv: this.groupsRv,
            groupsDef: this.groupsDef,
            editable: false,
            selectable: false,
            withCheckboxes: false
        };
    }
});
