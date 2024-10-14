/*
 * /imports/group/components/groups_panel/groups_panel.js
 *
 * Display the groups tree as a read-only component, and an 'edit' button.
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization as an entity with its DYN.records array
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - plus all plusButton parameters will be passed through
 */

import { Modal } from 'meteor/pwix:modal';
import { ReactiveVar } from 'meteor/reactive-var';
import { TenantsManager } from 'meteor/pwix:tenants-manager';

import '/imports/client/components/groups_buttons/groups_buttons.js';
import '/imports/client/components/groups_edit_dialog/groups_edit_dialog.js';
import '/imports/client/components/groups_tree/groups_tree.js';

import './groups_panel.html';

Template.groups_panel.onCreated( function(){
    const self = this;
    
    self.APP = {
        groups: new ReactiveVar( [] )
    };

    self.autorun(() => {
        const item = Template.currentData().item.get();
        const organization = TenantsManager.list.byEntity( item._id );
        if( organization ){
            self.APP.groups.set( organization.DYN.groups.get());
        }
    });
});

Template.groups_panel.helpers({
    parmsButtons(){
        return {
            item: this.item,
            checker: this.checker,
            groups: Template.instance().APP.groups,
            editable: false
        };
    },
    parmsTree(){
        return {
            item: this.item,
            checker: this.checker,
            groups: Template.instance().APP.groups,
            editable: false
        };
    }
});

Template.groups_panel.events({
    'click .c-groups-buttons .js-edit-tree'( event, instance ){
        Modal.run({
            item: this.item,
            checker: this.checker,
            groups: instance.APP.groups,
            organization: this.organization,
            editable: true,
            mdBody: 'groups_edit_dialog',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-lg',
            mdClassesContent: Meteor.APP.runContext.pageUIClasses().join( ' ' ),
            mdTitle: pwixI18n.label( I18N, 'groups.edit.dialog_title' )
        });
    }
});
