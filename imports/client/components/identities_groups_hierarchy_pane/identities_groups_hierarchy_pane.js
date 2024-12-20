/*
 * /imports/client/components/identities_groups_hierarchy_pane/identities_groups_hierarchy_pane.js
 *
 * Display the groups.
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization as an entity with its DYN.records array
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - groups: a ReactiveVar which contains a deep copy of the groups of the organization, to be edited
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import { IdentitiesGroups } from '/imports/common/collections/identities_groups/index.js';

import { IdentityGroupType } from '/imports/common/definitions/identity-group-type.def.js';

import '/imports/client/components/groups_tree_edit/groups_tree_edit.js';
import '/imports/client/components/identities_select_dialog/identities_select_dialog.js';
import '/imports/client/components/identity_group_edit_dialog/identity_group_edit_dialog.js';

import './identities_groups_hierarchy_pane.html';

Template.identities_groups_hierarchy_pane.onCreated( function(){
    const self = this;

    self.APP = {
        // the current tree selected node
        tree_selected: new ReactiveVar( null ),
        // keep the groups ReactiveVar from the initial data context in case it would change
        groupsRv: null,
        // the identities ids which are members of currently selected group
        groupIdentities: new ReactiveVar( [] ),
        // a function to get the current tree content
        fnGet: null,

        // return the selected item
        selectedItem(){
            const node = self.APP.tree_selected.get();
            return node.original.doc;
        },

        // set the identities attached to the current group
        // selected: an array of selected identities
        setIdentities( selected, dc ){
            const selectedGroupNode = self.APP.tree_selected.get();
            if( selectedGroupNode && self.APP.fnGet ){
                let newgroups = [];
                const flat = IdentitiesGroups.fn.tree2flat( dc.item.get()._id, self.APP.fnGet());
                // remove identities attached to the selected group
                flat.forEach(( it ) => {
                    if( it.type !== 'I' || it.parent !== selectedGroupNode.id ){
                        newgroups.push( it );
                    }
                });
                // re-attach newly selected identities
                selected.forEach(( it ) => {
                    newgroups.push({ type: 'I', identity: it._id, parent: selectedGroupNode.id, DYN: { label: it.DYN?.label }});
                });
                // and set new groups
                dc.groups.set( newgroups );
            }
        }
    };

    // track the identities which are members of currently selected group
    self.autorun(() => {
        const node = self.APP.tree_selected.get();
        const group = node ? node.original.doc : null;
        let identities = [];
        if( group ){
            IdentitiesGroups.fn.getIdentities( Template.currentData().item.get()._id, Template.currentData().groups.get(), group ).forEach(( it ) => {
                identities.push( it );
            });
        }
        self.APP.groupIdentities.set( identities );
        //console.debug( 'group', group, 'identities', self.APP.identities.get());
    });

    // keep the groups ReactiveVar
    self.autorun(() => {
        self.APP.groupsRv = Template.currentData().groups;
    });
});

Template.identities_groups_hierarchy_pane.helpers({
    // parms for groups_tree_edit
    parmsTreeEdit(){
        return {
            item: this.item,
            checker: this.checker,
            treeName: 'identities_groups_hierarchy_pane',
            groupsRv: Template.instance().APP.groupsRv,
            groupsDef: IdentityGroupType,
            withIdentities: true
        };
    }
});

Template.identities_groups_hierarchy_pane.events({
    'tree-fns .c-identities-groups-hierarchy-pane'( event, instance, data ){
        instance.APP.fnGet = data.fnGet;
    },

    'tree-rowselect .c-identities-groups-hierarchy-pane'( event, instance, data ){
        instance.APP.tree_selected.set( data.node );
    },

    'identities-validated .c-identities-groups-hierarchy-pane'( event, instance, data ){
        instance.APP.setIdentities( data.items, this );
    },

    'click .js-identities'( event, instance ){
        Modal.run({
            ...this,
            organization: this.item.get(),
            selected: instance.APP.groupIdentities.get(),
            selectTarget: instance.$( '.c-identities-groups-hierarchy-pane' ),
            mdBody: 'identities_select_dialog',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-lg',
            mdTitle: pwixI18n.label( I18N, 'identities.select.dialog_title' )
        });
        return false;
    },

    'click .js-new-item'( event, instance ){
        Modal.run({
            ...this,
            organization: this.item.get(),
            targetDatabase: false,
            groupsRv: instance.APP.groupsRv,
            mdBody: 'identity_group_edit_dialog',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-lg',
            mdTitle: pwixI18n.label( I18N, 'groups.new.identity_dialog_title' ),
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
            groupsRv: instance.APP.groupsRv,
            mdBody: 'identity_group_edit_dialog',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-lg',
            mdTitle: pwixI18n.label( I18N, 'groups.edit.identity_dialog_title', item.label ),
            item: item
        });
    }
});
