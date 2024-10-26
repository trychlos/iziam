/*
 * /imports/group/components/identities_groups_tree_view/identities_groups_tree_view.js
 *
 * Display the groups tree as a read-only component, and an 'edit' button.
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization as an entity with its DYN.records array
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 */

import { Modal } from 'meteor/pwix:modal';
import { ReactiveVar } from 'meteor/reactive-var';
import { TenantsManager } from 'meteor/pwix:tenants-manager';

import '/imports/client/components/groups_buttons/groups_buttons.js';
import '/imports/client/components/groups_tree/groups_tree.js';
import '/imports/client/components/identities_groups_edit_dialog/identities_groups_edit_dialog.js';

import './identities_groups_tree_view.html';

Template.identities_groups_tree_view.onCreated( function(){
    const self = this;

    self.APP = {
        // address the *saved* organization entity
        organization: new ReactiveVar( [] )
    };

        // address the groups from the organization entity
        self.autorun(() => {
        const item = Template.currentData().item.get();
        self.APP.organization.set( TenantsManager.list.byEntity( item._id ));
    });
});

Template.identities_groups_tree_view.helpers({
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
            groups: Template.instance().APP.organization.get().DYN.identities_groups.get(),
            editable: false,
            withCheckboxes: false
        };
    }
});

Template.identities_groups_tree_view.events({
    'click .c-groups-buttons .js-edit-tree'( event, instance ){
        Modal.run({
            item: this.item,
            checker: this.checker,
            mdBody: 'identities_groups_edit_dialog',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-lg',
            mdClassesContent: Meteor.APP.runContext.pageUIClasses().join( ' ' ),
            mdTitle: pwixI18n.label( I18N, 'groups.edit.dialog_title' )
        });
    }
});
