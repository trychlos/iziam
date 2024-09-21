/*
 * /imports/client/components/keygrip_new_button/keygrip_new_button.js
 *
 * Let the organization manager define a new Keygrip secret.
 *
 * Parms:
 * - entity: a ReactiveVar which contains the Organization, with its DYN.records array of ReactiveVar's
 * - index: the index of the current edited organization record
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - plus all plusButton parameters will be passed through
 */

import _ from 'lodash';

import { Modal } from 'meteor/pwix:modal';
import { Permissions } from 'meteor/pwix:permissions';
import { PlusButton } from 'meteor/pwix:plus-button';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import '../keygrip_edit_dialog/keygrip_edit_dialog.js';

import './keygrip_new_button.html';

Template.keygrip_new_button.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        canCreate: new ReactiveVar( false )
    };

    // check the creation permission
    // any organization manager can create a new json web key
    self.autorun( async () => {
        self.APP.canCreate.set( await Permissions.isAllowed( 'feat.organizations.edit', Meteor.userId(), Template.currentData().entity.get()._id ));
    });

    // track the creation permission
    self.autorun( async () => {
        //console.debug( 'canCreate', self.APP.canCreate.get());
    });
});

Template.keygrip_new_button.helpers({
    // whether the user is allowed to create a new tenant
    canCreate(){
        return Template.instance().APP.canCreate.get();
    },

    // parms for PlusButton
    parmsPlusButton(){
        return {
            ...this,
            label: pwixI18n.label( I18N, 'keygrips.edit.new_button_label' ),
            title: pwixI18n.label( I18N, 'keygrips.edit.new_button_title' ),
            shape: PlusButton.C.Shape.RECTANGLE,
            enabled: Template.instance().APP.canCreate
        }
    }
});

Template.keygrip_new_button.events({
    'click .plusButton'( event, instance ){
        //console.debug( this );
        Modal.run({
            ...this,
            mdBody: 'keygrip_edit_dialog',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-lg',
            mdClassesContent: Meteor.APP.runContext.pageUIClasses().join( ' ' ),
            mdTitle: pwixI18n.label( I18N, 'keygrips.edit.new_dialog_title' ),
            item: null
        });
        return false;
    }
});
