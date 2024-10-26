/*
 * /imports/client/components/clients_groups_hierarchy_pane/clients_groups_hierarchy_pane.js
 *
 * Display the groups.
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization as an entity with its DYN.records array
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - groups: a ReactiveVar which contains a deep copy of the groups of the organization, to be edited
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import { ClientsGroups } from '/imports/common/collections/clients_groups/index.js';

import '/imports/client/components/groups_buttons/groups_buttons.js';
import '/imports/client/components/groups_tree/groups_tree.js';
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
        // whether the buttons can be enabled
        editEnabled: new ReactiveVar( false ),
        removeEnabled: new ReactiveVar( false ),
        clientsEnabled: new ReactiveVar( false ),

        // return the selected item
        selectedItem(){
            const node = self.APP.tree_selected.get();
            return node.original.doc;
        },

        // set the clients attached to the current group
        setClients( selected, dc ){
            const selectedGroupNode = self.APP.tree_selected.get();
            if( selectedGroupNode ){
                let newgroups = [];
                let found = false;
                // remove clients attached to the selected group
                dc.groups.get().forEach(( it ) => {
                    if( it.type !== 'C' || it.parent !== selectedGroupNode.id ){
                        newgroups.push( it );
                    }
                });
                // re-attach new clients
                selected.forEach(( it ) => {
                    newgroups.push({ type: 'C', client: it._id, parent: selectedGroupNode.id, DYN: { label: it.DYN?.label }});
                });
                // and set new groups
                dc.groups.set( newgroups );
            }
        }
    };

    // enable/disable the buttons
    self.autorun(() => {
        const node = self.APP.tree_selected.get();
        const type = node && node.type ? node.type : null
        self.APP.editEnabled.set( type === 'G' );
        self.APP.removeEnabled.set( Boolean( type ));
        self.APP.clientsEnabled.set( type === 'G' );
    });

    // track the groups
    self.autorun(() => {
        console.debug( 'groups', Template.currentData().groups.get());
    });

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
        console.debug( 'group', group, 'clients', self.APP.groupClients.get());
    });
});

Template.clients_groups_hierarchy_pane.helpers({
    parmsButtons(){
        return {
            ...this,
           editEnabled: Boolean( Template.instance().APP.editEnabled.get()),
           removeEnabled: Boolean( Template.instance().APP.removeEnabled.get()),
           clientsEnabled: Boolean( Template.instance().APP.clientsEnabled.get()),
           withClients: true
        };
    },
    parmsTree(){
        return {
            ...this,
            groups: this.groups.get(),
            withCheckboxes: false,
            noDataText: pwixI18n.label( I18N, 'groups.tree.no_data_two' )
        };
    }
});

Template.clients_groups_hierarchy_pane.events({
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
            selected: instance.APP.groupIdentities.get(),
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
            mdTitle: pwixI18n.label( I18N, 'groups.edit.dialog_title' ),
            item: item
        });
    },

    'click .js-remove-item'( event, instance ){
        instance.$( '.c-groups-tree' ).trigger( 'tree-remove-node', { node: instance.APP.selectedItem() });
        instance.$( '.c-groups-tree' ).trigger( 'tree-rowselect', { node: null });
    }
});
