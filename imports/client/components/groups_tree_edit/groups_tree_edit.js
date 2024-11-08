/*
 * /imports/group/components/groups_tree_edit/groups_tree_edit.js
 *
 * Display the groups tree as a full editable component, and CRUD buttons.
 * 
 * - input is the registrar content
 * - display the whole groups tree
 * - display the clients/identities leaves
 * - have CRUD buttons: new, edit, remove, add leave
 * - allow DnD
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization as an entity with its DYN.records array
 * - checker: a ReactiveVar which contains the parent Forms.Checker,
 * - treeName: an optional name to be displayed in debug messages
 * - groupsRv: a ReactiveVar which contains the groups of the organization
 * - groupsDef: the definition of the target groups type
 * - withIdentities: whether to display the 'Add identities' button, defaulting to false
 * - withClients: whether to display the 'Add clients' button, defaulting to false
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import '/imports/client/components/groups_buttons/groups_buttons.js';
import '/imports/client/components/groups_tree/groups_tree.js';

import './groups_tree_edit.html';

Template.groups_tree_edit.onCreated( function(){
    const self = this;

    self.APP = {
        // the current tree selected node
        tree_selected: new ReactiveVar( null ),
        // whether the buttons can be enabled
        editEnabled: new ReactiveVar( false ),
        removeEnabled: new ReactiveVar( false ),
        leafEnabled: new ReactiveVar( false ),
    };

    // enable/disable the CRUD buttons
    self.autorun(() => {
        const node = self.APP.tree_selected.get();
        const type = node && node.type ? node.type : null
        self.APP.editEnabled.set( type === 'G' );
        self.APP.removeEnabled.set( Boolean( type ));
        self.APP.leafEnabled.set( type === 'G' );
    });
});

Template.groups_tree_edit.helpers({
    parmsButtons(){
        return {
            ...this,
            editEnabled: Boolean( Template.instance().APP.editEnabled.get()),
            removeEnabled: Boolean( Template.instance().APP.removeEnabled.get()),
            leafEnabled: Boolean( Template.instance().APP.leafEnabled.get()),
        };
    },
    parmsTree(){
        return {
            ...this,
            withCheckboxes: false,
            noDataText: pwixI18n.label( I18N, 'groups.tree.no_data_two' )
        };
    }
});

Template.groups_tree_edit.events({
    'tree-rowselect .c-groups-tree-edit'( event, instance, data ){
        instance.APP.tree_selected.set( data.node );
    },

    'click .js-remove-item'( event, instance ){
        const node = instance.APP.tree_selected.get();
        instance.$( '.c-groups-tree' ).trigger( 'tree-remove-node', { node: node.original.doc });
        instance.$( '.c-groups-tree' ).trigger( 'tree-rowselect', { node: null });
    }
});
