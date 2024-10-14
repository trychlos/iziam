/*
 * /imports/client/components/groups_hierarchy_pane/groups_hierarchy_pane.js
 *
 * Display the groups.
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization as an entity with its DYN.records array
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - groups: the groups of the organization
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import { Groups } from '/imports/common/collections/groups/index.js';

import '/imports/client/components/group_new_button/group_new_button.js';
import '/imports/client/components/groups_panel/groups_panel.js';
import '/imports/client/components/identities_select_dialog/identities_select_dialog.js';

import './groups_hierarchy_pane.html';

Template.groups_hierarchy_pane.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        // the current tree selected node
        tree_selected: new ReactiveVar( null ),
        // the identities ids which are members of currently selected group
        groupIdentities: new ReactiveVar( [] ),
        // whether the buttons can be enabled
        editEnabled: new ReactiveVar( false ),
        removeEnabled: new ReactiveVar( false ),
        identitiesEnabled: new ReactiveVar( false ),

        // return the selected item
        selectedItem(){
            const node = self.APP.tree_selected.get();
            return node.original.doc;
        },

        // set the identities attached to the current group
        setIdentities( selected, dc ){
            const selectedGroupNode = self.APP.tree_selected.get();
            if( selectedGroupNode ){
                const groups = dc.groups.get();
                let newgroups = [];
                let found = false;
                // remove identities whose parent if the selected group
                groups.forEach(( it ) => {
                    if( it.type !== 'I' || it.parent !== selectedGroupNode.id ){
                        newgroups.push( it );
                    }
                });
                // add identities
                selected.forEach(( it ) => {
                    newgroups.push({ type: 'I', _id: it._id, parent: selectedGroupNode.id, DYN: { label: it.DYN?.label }});
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
        self.APP.identitiesEnabled.set( type === 'G' );
    });

    // track the groups
    self.autorun(() => {
        //console.debug( 'groups', Template.currentData().groups.get());
    });

    // track the identities which are members of currently selected group
    self.autorun(() => {
        const node = self.APP.tree_selected.get();
        const group = node ? node.original.doc : null;
        let identities = [];
        if( group ){
            Groups.fn.getIdentities( Template.currentData().item.get(), Template.currentData().groups.get(), group ).forEach(( it ) => {
                identities.push( it );
            });
        }
        self.APP.groupIdentities.set( identities );
        //console.debug( 'group', group, 'identities', self.APP.identities.get());
    });
});

Template.groups_hierarchy_pane.helpers({
    parmsButtons(){
        return {
            ...this,
           editEnabled: Boolean( Template.instance().APP.editEnabled.get()),
           removeEnabled: Boolean( Template.instance().APP.removeEnabled.get()),
           identitiesEnabled: Boolean( Template.instance().APP.identitiesEnabled.get())
        };
    },
    parmsTree(){
        return {
            ...this,
            withCheckboxes: false
        };
    }
});

Template.groups_hierarchy_pane.events({
    'tree-rowselect .c-groups-hierarchy-pane'( event, instance, data ){
        instance.APP.tree_selected.set( data.node );
    },

    'identities-validated .c-groups-hierarchy-pane'( event, instance, data ){
        instance.APP.setIdentities( data.items, this );
    },

    'click .js-identities'( event, instance ){
        Modal.run({
            ...this,
            organization: this.item.get(),
            targetDatabase: false,
            groupsRv: this.groups,
            selected: instance.APP.groupIdentities.get(),
            mdBody: 'identities_select_dialog',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-lg',
            mdClassesContent: Meteor.APP.runContext.pageUIClasses().join( ' ' ),
            mdTitle: pwixI18n.label( I18N, 'identities.select.dialog_title' ),
            selectTarget: instance.$( '.c-groups-hierarchy-pane' ),
            item: null
        });
        return false;
    },

    'click .js-new-item'( event, instance ){
        Modal.run({
            ...this,
            organization: this.item.get(),
            targetDatabase: false,
            groupsRv: this.groups,
            mdBody: 'group_edit_dialog',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-lg',
            mdClassesContent: Meteor.APP.runContext.pageUIClasses().join( ' ' ),
            mdTitle: pwixI18n.label( I18N, 'groups.new.dialog_title' ),
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
            mdBody: 'group_edit_dialog',
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
