/*
 * /imports/client/components/authorization_new_button/authorization_new_button.js
 *
 * Let the organization/client manager define a new JSON Web Key.
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization as an entity with its DYN.records array
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 */

import _ from 'lodash';

import { Forms } from 'meteor/pwix:forms';
import { Modal } from 'meteor/pwix:modal';
import { Permissions } from 'meteor/pwix:permissions';
import { PlusButton } from 'meteor/pwix:plus-button';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import '/imports/client/components/authorization_edit_dialog/authorization_edit_dialog.js';

import './authorization_new_button.html';

Template.authorization_new_button.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        canCreate: new ReactiveVar( false ),
    };

    // last allow or not the creation
    self.autorun(() => {
        const item = Template.currentData().item.get();
        Permissions.isAllowed( 'feat.authorizations.create', this.userId, item._id ).then(( res ) => { self.APP.canCreate.set( res ); });
    });
});

Template.authorization_new_button.helpers({
    // whether the user is allowed to create a new tenant
    canCreate(){
        return Template.instance().APP.canCreate.get();
    },

    // parms for PlusButton
    parmsPlusButton(){
        return {
            ...this,
            label: pwixI18n.label( I18N, 'authorizations.edit.new_button_label' ),
            title: pwixI18n.label( I18N, 'authorizations.edit.new_button_title' ),
            shape: PlusButton.C.Shape.RECTANGLE,
            enabled: Template.instance().APP.canCreate
        }
    }
});

Template.authorization_new_button.events({
    'click .plusButton'( event, instance ){
        //console.debug( this );
        Modal.run({
            ...this,
            item: null,
            entity: this.item.get(),
            mdBody: 'authorization_edit_dialog',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-lg',
            //mdClassesContent: Meteor.APP.runContext.pageUIClasses().join( ' ' ),
            mdTitle: pwixI18n.label( I18N, 'authorizations.edit.new_dialog_title' )
        });
        return false;
    }
});
