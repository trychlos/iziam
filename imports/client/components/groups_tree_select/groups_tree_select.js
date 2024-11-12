/*
 * /imports/client/components/groups_tree_select/groups_tree_select.js
 *
 * Let one group be selected in the groups tree hierarchy.
 * Buttons are not displayed.
 * 
 * Parms:
 * - treeName: an optional name to be displayed in debug messages
 * - groupsRv: a ReactiveVar which contains the groups of the organization
 * - groupsDef: the definition of the target groups type
 * - selected: the initially selected group identifier
 * 
 * Events:
 * - group-selected: advertise of the new selected group
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import './groups_tree_select.html';

Template.groups_tree_select.helpers({
    // parms for the groups_tree component
    parmsTree(){
        return {
            ...this,
            editable: false,
            withCheckboxes: false,
            withClients: false,
            withIdentities: false,
        };
    }
});

Template.groups_tree_select.events({
    // when the tree is ready, set the initial selection
    'tree-ready .c-groups-tree-select'( event, instance, data ){
        if( data.ready && this.selected ){
            instance.$( '.c-groups-tree' ).trigger( 'tree-select-node', { id: this.selected });
        }
    },

    // new group selection
    'tree-rowselect .c-groups-tree-select'( event, instance, data ){
        instance.$( '.c-groups-tree-select' ).trigger( 'group-selected', { selected: data.node.original.doc });
    }
});
