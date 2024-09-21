/*
 * /imports/client/components/jwk_new_button/jwk_new_button.js
 *
 * Let the organization/client manager define a new JSON Web Key.
 *
 * Parms:
 * - entity: a ReactiveVar which contains the Organization/Client, with its DYN.records array of ReactiveVar's
 * - index: the index of the current edited organization/client record
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - isOrganization: whether the JWK is to be created into an organization, defaulting to true
 * - plus all plusButton parameters will be passed through
 */

import _ from 'lodash';

import { Forms } from 'meteor/pwix:forms';
import { Modal } from 'meteor/pwix:modal';
import { Permissions } from 'meteor/pwix:permissions';
import { PlusButton } from 'meteor/pwix:plus-button';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { TM } from 'meteor/pwix:typed-message';

import '../jwk_edit_dialog/jwk_edit_dialog.js';

import './jwk_new_button.html';

Template.jwk_new_button.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        // whether we have any empty key identifier ?
        emptyKid: new ReactiveVar( false ),
        // whether the user is allowed to ?
        permitted: new ReactiveVar( false ),
        // the boolean result of the previous conditions
        canCreate: new ReactiveVar( false ),
        // a dedicated checker to be able to interact with parent Messager
        checker: new ReactiveVar( null )
    };

    // To create a new JWK, we check that all already existing have a KID
    //  as a KID becomes mandatory as soon as we have several JWKs
    self.autorun( async () => {
        const entity = Template.currentData().entity.get();
        const hasEmpty = self.APP.emptyKid.get();
        let found = false;
        ( entity.DYN.records[Template.currentData().index].get().jwks || [] ).every(( it ) => {
            if( !it.kid ){
                found = true;
            }
            return !found;
        });
        if( found !== hasEmpty ){
            self.APP.emptyKid.set( found );
            //console.debug( 'emptyKid', found );
            checker = self.APP.checker.get();
            if( checker ){
                if( found ){
                    checker.messagerPush( new TM.TypedMessage({
                        level: TM.MessageLevel.C.INFO,
                        message: pwixI18n.label( I18N, 'jwks.checks.jwk_kid_empty' )
                    }));
                } else {
                    checker.messagerClear();
                }
            }
        }
    });

    // check the creation permission
    self.autorun( async () => {
        const entity = Template.currentData().entity.get();
        const permission = Template.currentData().isOrganization === false ? 'feat.clients.edit' : 'feat.organizations.edit';
        const permitted = await Permissions.isAllowed( permission, Meteor.userId(), entity._id );
        self.APP.permitted.set( permitted );
        //console.debug( 'permitted', permitted );
        checker = self.APP.checker.get();
        if( checker ){
            if( permitted ){
                checker.messagerClear();
            } else {
                checker.messagerPush( new TM.TypedMessage({
                    level: TM.MessageLevel.C.INFO,
                    message: pwixI18n.label( I18N, 'jwks.checks.jwk_not_permitted' )
                }));
            }
        }
    });

    // last allow or not the creation
    self.autorun( async () => {
        self.APP.canCreate.set( !self.APP.emptyKid.get() && self.APP.permitted.get());
    });
});

Template.jwk_new_button.onRendered( function(){
    const self = this;

    // instanciate a checker
    self.autorun(() => {
        const parentChecker = Template.currentData().checker.get();
        let checker = self.APP.checker.get();
        if( parentChecker && !checker ){
            self.APP.checker.set( new Forms.Checker( self, {
                parent: parentChecker
            }));
        }
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
            enabled: Template.instance().APP.canCreate
        }
    }
});

Template.jwk_new_button.events({
    'click .plusButton'( event, instance ){
        //console.debug( this );
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
