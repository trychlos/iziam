/*
 * /imports/client/components/resource_new_button/resource_new_button.js
 *
 * Let the organization manager define a new resource.
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization as an entity with its DYN.records array
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - plus all plusButton parameters will be passed through
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Forms } from 'meteor/pwix:forms';
import { Modal } from 'meteor/pwix:modal';
import { Permissions } from 'meteor/pwix:permissions';
import { PlusButton } from 'meteor/pwix:plus-button';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import '/imports/client/components/resource_edit_dialog/resource_edit_dialog.js';

import './resource_new_button.html';

Template.resource_new_button.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        canCreate: new ReactiveVar( false ),
        // a dedicated checker to be able to interact with parent Messager
        checker: new ReactiveVar( null )
    };

    // last allow or not the creation
    self.autorun(() => {
        const entity = Template.currentData().item.get();
        Permissions.isAllowed( 'feat.resources.create', Meteor.userId(), entity._id ).then(( res ) => { self.APP.canCreate.set( res ); });
    });
});

Template.resource_new_button.onRendered( function(){
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

Template.resource_new_button.helpers({
    // whether the user is allowed to create a new tenant
    canCreate(){
        return Template.instance().APP.canCreate.get();
    },

    // parms for PlusButton
    parmsPlusButton(){
        return {
            ...this,
            label: pwixI18n.label( I18N, 'resources.edit.new_button_label' ),
            title: pwixI18n.label( I18N, 'resources.edit.new_button_title' ),
            shape: PlusButton.C.Shape.RECTANGLE,
            enabled: Template.instance().APP.canCreate
        }
    }
});

Template.resource_new_button.events({
    'click .plusButton'( event, instance ){
        //console.debug( this );
        Modal.run({
            ...this,
            item: null,
            entity: this.item.get(),
            mdBody: 'resource_edit_dialog',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-lg',
            mdClassesContent: Meteor.APP.runContext.pageUIClasses().join( ' ' ),
            mdTitle: pwixI18n.label( I18N, 'resources.edit.new_dialog_title' )
        });
        return false;
    }
});
