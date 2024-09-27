/*
 * /imports/client/components/client_new_button/client_new_button.js
 *
 * Let the organization manager define a new client.
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - plus all plusButton parameters will be passed through
 */

import _ from 'lodash';

import { Modal } from 'meteor/pwix:modal';
import { Permissions } from 'meteor/pwix:permissions';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import '../client_new_assistant/client_new_assistant.js';

import './client_new_button.html';

Template.client_new_button.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        canCreate: new ReactiveVar( false )
    };

    // check the creation permission
    self.autorun( async () => {
        self.APP.canCreate.set( await Permissions.isAllowed( 'feat.clients.create', Meteor.userId(), Template.currentData().item.get()._id ));
    });

    // track the creation permission
    self.autorun( async () => {
        //console.debug( 'canCreate', self.APP.canCreate.get());
    });
});

Template.client_new_button.helpers({
    // client new button parameters
    parmsPlusButton(){
        return {
            ...this,
            label: pwixI18n.label( I18N, 'clients.new.button_label' ),
            shape: PlusButton.C.Shape.RECTANGLE,
            title: pwixI18n.label( I18N, 'clients.new.button_title' )
        }
    },
});

Template.client_new_button.events({
    'click .plusButton'( event, instance ){
        let dc = { ...this };
        delete dc.entityTabs;
        delete dc.recordTabs;
        delete dc.checker;
        const organization = {
            entity: this.item.get(),
            record: this.item.get().DYN.closest
        };
        Modal.run({
            ...dc,
            organization: organization,
            mdBody: 'client_new_assistant',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-xxl',
            mdClassesContent: Meteor.APP.runContext.pageUIClasses().join( ' ' ),
            mdTitle: pwixI18n.label( I18N, 'clients.new.assistant_title' ),
            item: null
        });
        return false;
    }
});
