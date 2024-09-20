/*
 * /imports/client/components/client_secret_new_button/client_secret_new_button.js
 *
 * Let the client manager define a new secret.
 *
 * Parms:
 * - entity: a ReactiveVar which contains the Organization/Client, with its DYN.records array of ReactiveVar's
 * - index: the index of the current edited organization/client record
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - plus all plusButton parameters will be passed through
 */

import _ from 'lodash';

import { Modal } from 'meteor/pwix:modal';
import { Permissions } from 'meteor/pwix:permissions';
import { PlusButton } from 'meteor/pwix:plus-button';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import '/imports/client/components/client_secret_edit_dialog/client_secret_edit_dialog.js';

import './client_secret_new_button.html';

Template.client_secret_new_button.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        canCreate: new ReactiveVar( false )
    };

    // check the creation permission
    // any client manager can create a new secret
    self.autorun( async () => {
        self.APP.canCreate.set( await Permissions.isAllowed( 'feat.clients.edit', Meteor.userId(), Template.currentData().entity.get()._id ));
    });

    // track the creation permission
    self.autorun( async () => {
        //console.debug( 'canCreate', self.APP.canCreate.get());
    });
});

Template.client_secret_new_button.helpers({
    // whether the user is allowed to create a new tenant
    canCreate(){
        return Template.instance().APP.canCreate.get();
    },

    // parms for PlusButton
    parmsPlusButton(){
        return {
            ...this,
            label: pwixI18n.label( I18N, 'clients.secrets.edit.new_button_label' ),
            title: pwixI18n.label( I18N, 'clients.secrets.edit.new_button_title' ),
            shape: PlusButton.C.Shape.RECTANGLE,
            enabled: Template.instance().APP.canCreate
        }
    }
});

Template.client_secret_new_button.events({
    'click .plusButton'( event, instance ){
        Modal.run({
            ...this,
            mdBody: 'client_secret_edit_dialog',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-lg',
            mdClassesContent: Meteor.APP.runContext.pageUIClasses().join( ' ' ),
            mdTitle: pwixI18n.label( I18N, 'clients.secrets.edit.new_dialog_title' ),
            item: null
        });
        return false;
    }
});
