/*
 * /imports/group/components/identity_group_new_button/identity_group_new_button.js
 *
 * Let the organization manager define a new group.
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization as an entity with its DYN.records array
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Modal } from 'meteor/pwix:modal';
import { Permissions } from 'meteor/pwix:permissions';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import '/imports/client/components/identity_group_edit_dialog/identity_group_edit_dialog.js';

import './identity_group_new_button.html';

Template.identity_group_new_button.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        allowed: new ReactiveVar( false ),
        enabled: new ReactiveVar( false )
    };

    // check the creation permission
    self.autorun( async () => {
        self.APP.allowed.set( await Permissions.isAllowed( 'feat.identities_groups.create', Meteor.userId(), Template.currentData().item.get()._id ));
    });

    // enable the PlusButton
    self.autorun(() => {
        self.APP.enabled.set( self.APP.allowed.get());
    });
});

Template.identity_group_new_button.helpers({
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

Template.identity_group_new_button.events({
    'click .plusButton'( event, instance ){
        let dc = { ...this };
        delete dc.entityTabs;
        delete dc.entityTabsAfter;
        delete dc.recordTabs;
        delete dc.recordTabsAfter;
        delete dc.checker;
        Modal.run({
            ...dc,
            organization: this.item.get(),
            mdBody: 'identity_group_edit_dialog',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-lg',
            mdClassesContent: Meteor.APP.runContext.pageUIClasses().join( ' ' ),
            mdTitle: pwixI18n.label( I18N, 'groups.new.dialog_title' ),
            item: null
        });
        return false;
    }
});
