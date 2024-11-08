/*
 * /imports/group/components/groups_tree_view/groups_tree_view.js
 *
 * Display the groups tree as a read-only component, and an 'edit' button.
 * 
 * - input is the registrar content
 * - display the whole groups tree
 * - display the clients/identities leaves + have a 'display clients/identities' button
 * - have an 'edit tree' button
 * - do not allow row select
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

import '/imports/client/components/groups_buttons/groups_buttons.js';
import '/imports/client/components/groups_tree/groups_tree.js';

import './groups_tree_view.html';

Template.groups_tree_view.helpers({
    parmsButtons(){
        return {
            ...this,
            editable: false
        };
    },
    parmsTree(){
        return {
            ...this,
            editable: false,
            selectable: false,
            withCheckboxes: false
        };
    }
});
