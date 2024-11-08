/*
 * /imports/client/components/clients_groups_hierarchy_pane/clients_groups_hierarchy_pane.js
 *
 * Edit the clients groups hierarchy.
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization as an entity with its DYN.records array
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - groups: a ReactiveVar which contains a deep copy of the groups of the organization, to be edited
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import { ClientsGroups } from '/imports/common/collections/clients_groups/index.js';

import { ClientGroupType } from '/imports/common/definitions/client-group-type.def.js';

import '/imports/client/components/groups_tree_edit/groups_tree_edit.js';
import '/imports/client/components/clients_select_dialog/clients_select_dialog.js';

import './clients_groups_hierarchy_pane.html';

Template.clients_groups_hierarchy_pane.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        // the current tree selected node
        tree_selected: new ReactiveVar( null ),
        // the clients ids which are members of currently selected group
        groupClients: new ReactiveVar( [] ),
        // a function to get the current tree content
        fnGet: null,

        // return the selected item
        selectedItem(){
            const node = self.APP.tree_selected.get();
            return node.original.doc;
        },

        // set the clients attached to the current group
        // selected: an array of selected clients with their DYN sub-object
        setClients( selected, dc ){
            const selectedGroupNode = self.APP.tree_selected.get();
            if( selectedGroupNode && self.APP.fnGet ){
                let newgroups = [];
                const flat = ClientsGroups.fn.tree2flat( dc.item.get()._id, self.APP.fnGet());
                // remove clients attached to the selected group
                flat.forEach(( it ) => {
                    if( it.type !== 'C' || it.parent !== selectedGroupNode.id ){
                        newgroups.push( it );
                    }
                });
                // re-attach newly selected clients
                selected.forEach(( it ) => {
                    newgroups.push({ type: 'C', client: it._id, parent: selectedGroupNode.id, DYN: { label: it.DYN.closest.label }});
                });
                // and set new groups
                dc.groups.set( newgroups );
            }
        }
    };

    // track the clients which are members of currently selected group
    self.autorun(() => {
        const node = self.APP.tree_selected.get();
        const group = node ? node.original.doc : null;
        let clients = [];
        if( group ){
            ClientsGroups.fn.getClients( Template.currentData().item.get()._id, Template.currentData().groups.get(), group ).forEach(( it ) => {
                clients.push( it );
            });
        }
        self.APP.groupClients.set( clients );
        //console.debug( 'group', group, 'clients', self.APP.groupClients.get());
    });
});

Template.clients_groups_hierarchy_pane.helpers({
    // parms for groups_tree_edit
    parmsTreeEdit(){
        return {
            ...this,
            treeName: 'clients_groups_hierarchy_pane',
            groupsRv: this.groups,
            groupsDef: ClientGroupType,
            withClients: true
         };
    }
});

Template.clients_groups_hierarchy_pane.events({
    'tree-fns .c-clients-groups-hierarchy-pane'( event, instance, data ){
        instance.APP.fnGet = data.fnGet;
    },

    'tree-rowselect .c-clients-groups-hierarchy-pane'( event, instance, data ){
        instance.APP.tree_selected.set( data.node );
    },

    'clients-validated .c-clients-groups-hierarchy-pane'( event, instance, data ){
        instance.APP.setClients( data.items, this );
    },

    'click .js-clients'( event, instance ){
        Modal.run({
            ...this,
            organization: this.item.get(),
            selected: instance.APP.groupClients.get(),
            selectTarget: instance.$( '.c-clients-groups-hierarchy-pane' ),
            mdBody: 'clients_select_dialog',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-lg',
            mdClassesContent: Meteor.APP.runContext.pageUIClasses().join( ' ' ),
            mdTitle: pwixI18n.label( I18N, 'clients.select.dialog_title' )
        });
        return false;
    },

    'click .js-new-item'( event, instance ){
        Modal.run({
            ...this,
            organization: this.item.get(),
            targetDatabase: false,
            groupsRv: this.groups,
            mdBody: 'client_group_edit_dialog',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-lg',
            mdClassesContent: Meteor.APP.runContext.pageUIClasses().join( ' ' ),
            mdTitle: pwixI18n.label( I18N, 'groups.new.client_dialog_title' ),
            item: null
        });
        return false;
    },

    'click .js-edit-item'( event, instance ){
        const item = instance.APP.selectedItem();
        Modal.run({
            ...this,
            organization: this.item.get(),
            targetDatabase: false,
            groupsRv: this.groups,
            mdBody: 'client_group_edit_dialog',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-lg',
            mdClassesContent: Meteor.APP.runContext.pageUIClasses().join( ' ' ),
            mdTitle: pwixI18n.label( I18N, 'groups.edit.client_dialog_title', item.label ),
            item: item
        });
    }
});
