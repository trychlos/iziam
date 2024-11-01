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
import { strict as assert } from 'node:assert';

import { Forms } from 'meteor/pwix:forms';
import { Modal } from 'meteor/pwix:modal';
import { PlusButton } from 'meteor/pwix:plus-button';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import { Jwks } from '/imports/common/tables/jwks/index.js';

import '../jwk_edit_dialog/jwk_edit_dialog.js';

import './jwk_new_button.html';

Template.jwk_new_button.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        canCreate: new ReactiveVar( false ),
        // a dedicated checker to be able to interact with parent Messager
        checker: new ReactiveVar( null )
    };

    // last allow or not the creation
    self.autorun(() => {
        const entity = Template.currentData().entity.get();
        Jwks.checks.canCreate({
            entity: entity,
            record: entity.DYN.records[Template.currentData().index].get()
        }, Meteor.userId(), {
            isOrganization: Template.currentData.isOrganization !== false
        }).then(( res ) => {
            // res is null or an array of TypedMessage's
            self.APP.canCreate.set( res === null );
            const checker = self.APP.checker.get();
            if( checker ){
                if( res ){
                    checker.messagerPush( res );
                } else {
                    checker.messagerClearMine();
                }
            }
        })
    });
});

Template.jwk_new_button.onRendered( function(){
    const self = this;

    // instanciate a checker
    self.autorun(() => {
        const parentChecker = Template.currentData().checker?.get();
        const checker = self.APP.checker.get();
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
