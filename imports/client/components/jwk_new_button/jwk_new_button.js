/*
 * /imports/client/components/jwk_new_button/jwk_new_button.js
 *
 * Let the organization/client manager define a new JSON Web Key.
 *
 * Parms:
 * - entity: a ReactiveVar which contains the Organization, with its DYN.records array of ReactiveVar's
 * - index: the index of the current edited organization/client record
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - isOrganization: whether the JWK is to be created into an organization, defaulting to true
 * - plus all plusButton parameters will be passed through
 */

import _ from 'lodash';

import { Modal } from 'meteor/pwix:modal';
import { Permissions } from 'meteor/pwix:permissions';
import { PlusButton } from 'meteor/pwix:plus-button';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import '../jwk_edit_dialog/jwk_edit_dialog.js';

import './jwk_new_button.html';

Template.jwk_new_button.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        canCreate: new ReactiveVar( false )
    };

    // check the creation permission
    // any organization/client manager can create a new json web key
    self.autorun( async () => {
        const permission = Template.currentData().isOrganization === false ? 'feat.clients.edit' : 'feat.organizations.edit';
        self.APP.canCreate.set( await Permissions.isAllowed( permission, Template.currentData().entity.get()._id, Meteor.userId()));
    });

    // track the creation permission
    self.autorun( async () => {
        //console.debug( 'canCreate', self.APP.canCreate.get());
    });
});

Template.jwk_new_button.helpers({
    // whether the user is allowed to create a new tenant
    canCreate(){
        return Template.instance().APP.canCreate.get();
    },

    // parms for PlusButton
    parmsPlusButton(){
        return {
            ...this,
            label: pwixI18n.label( I18N, 'jwks.edit.new_button_label' ),
            title: pwixI18n.label( I18N, 'jwks.edit.new_button_title' ),
            shape: PlusButton.C.Shape.RECTANGLE,
            enabled: Template.instance().canCreate
        }
    }
});

Template.jwk_new_button.events({
    'click .plusButton'( event, instance ){
        Modal.run({
            ...this,
            mdBody: 'jwk_edit_dialog',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-lg',
            mdClassesContent: Meteor.APP.runContext.pageUIClasses().join( ' ' ),
            mdTitle: pwixI18n.label( I18N, 'jwks.edit.new_dialog_title' ),
            item: null
        });
        return false;
    }
});
