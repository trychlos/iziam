/*
 * /imports/group/components/clients_groups_tree_view/clients_groups_tree_view.js
 *
 * Display the groups tree as a read-only component, and an 'edit' button.
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization as an entity with its DYN.records array
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Modal } from 'meteor/pwix:modal';
import { ReactiveVar } from 'meteor/reactive-var';
import { TenantsManager } from 'meteor/pwix:tenants-manager';

import { ClientGroupType } from '/imports/common/definitions/client-group-type.def.js';

import '/imports/client/components/clients_groups_edit_dialog/clients_groups_edit_dialog.js';
import '/imports/client/components/groups_buttons/groups_buttons.js';
import '/imports/client/components/groups_tree/groups_tree.js';

import './clients_groups_tree_view.html';

Template.clients_groups_tree_view.onCreated( function(){
    const self = this;

    self.APP = {
        // address the *saved* organization entity
        organization: new ReactiveVar( [] ),
        // the groups
        groups: new ReactiveVar( [] )
    };

    // address the organization entity
    self.autorun(() => {
        const item = Template.currentData().item.get();
        self.APP.organization.set( TenantsManager.list.byEntity( item._id ));
    });

    // address the groups
    self.autorun(() => {
        self.APP.groups.set( self.APP.organization.get().DYN.clients_groups.get());
    });
});

Template.clients_groups_tree_view.helpers({
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
            groupsRv: Template.instance().APP.groups,
            groupTypeDef: ClientGroupType,
            editable: false,
            selectable: false,
            withCheckboxes: false
        };
    }
});

Template.clients_groups_tree_view.events({
    'click .c-groups-buttons .js-edit-tree'( event, instance ){
       Modal.run({
            item: this.item,
            checker: this.checker,
            mdBody: 'clients_groups_edit_dialog',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-lg',
            mdClassesContent: Meteor.APP.runContext.pageUIClasses().join( ' ' ),
            mdTitle: pwixI18n.label( I18N, 'groups.edit.clients_groups_dialog_title' )
        });
    }
});
