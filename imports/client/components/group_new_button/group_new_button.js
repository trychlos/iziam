/*
 * /imports/group/components/group_new_button/group_new_button.js
 *
 * Let the organization manager define a new group.
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - plus all plusButton parameters will be passed through
 * - organization: an { entity, record } organization object
 */

import _ from 'lodash';

import { Modal } from 'meteor/pwix:modal';
import { Permissions } from 'meteor/pwix:permissions';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import '/imports/client/components/group_edit_dialog/group_edit_dialog.js';

import './group_new_button.html';

Template.group_new_button.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        allowed: new ReactiveVar( false ),
        organization: new ReactiveVar( null ),
        enabled: new ReactiveVar( false )
    };

    // check the creation permission
    self.autorun( async () => {
        self.APP.allowed.set( await Permissions.isAllowed( 'feat.groups.create', Meteor.userId(), Template.currentData().item.get()._id ));
    });

    // build the organization { entity, record } object
    self.autorun(() => {
        const item = Template.currentData().item.get();
        self.APP.organization.set({
            entity: item,
            record: item.DYN.closest
        });
    });

    // enable the PlusButton
    self.autorun(() => {
        self.APP.enabled.set( self.APP.allowed.get());
    });
});

Template.group_new_button.helpers({
    // group new button parameters
    parmsPlusButton(){
        return {
            ...this,
            label: pwixI18n.label( I18N, 'groups.new.button_label' ),
            shape: PlusButton.C.Shape.RECTANGLE,
            title: pwixI18n.label( I18N, 'groups.new.button_title' ),
            enabled: Template.instance().APP.enabled
        }
    },
});

Template.group_new_button.events({
    'click .plusButton'( event, instance ){
        let dc = { ...this };
        delete dc.entityTabs;
        delete dc.entityTabsAfter;
        delete dc.recordTabs;
        delete dc.recordTabsAfter;
        delete dc.checker;
        Modal.run({
            ...dc,
            organization: instance.APP.organization.get(),
            mdBody: 'group_edit_dialog',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-lg',
            mdClassesContent: Meteor.APP.runContext.pageUIClasses().join( ' ' ),
            mdTitle: pwixI18n.label( I18N, 'groups.new.dialog_title' ),
            item: null
        });
        return false;
    }
});
