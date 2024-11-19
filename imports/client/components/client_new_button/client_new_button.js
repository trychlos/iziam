/*
 * /imports/client/components/client_new_button/client_new_button.js
 *
 * Let the organization manager define a new client.
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization as an entity with its DYN.records array
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - plus all plusButton parameters will be passed through
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

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
        allowed: new ReactiveVar( false ),
        haveProviders: new ReactiveVar( false ),
        enabled: new ReactiveVar( false )
    };

    // check the creation permission
    self.autorun( async () => {
        self.APP.allowed.set( await Permissions.isAllowed( 'feat.clients.create', Meteor.userId(), Template.currentData().item.get()._id ));
    });

    // must have providers
    self.autorun(() => {
        const selectedProviders = Template.currentData().item.get().DYN.closest.selectedProviders;
        self.APP.haveProviders.set( selectedProviders && _.isArray( selectedProviders ) && selectedProviders.length );
    });

    // enable the PlusButton
    self.autorun(() => {
        self.APP.enabled.set( self.APP.allowed.get() && self.APP.haveProviders.get());
    });

    // track the enabled status
    self.autorun(() => {
        //console.debug( 'allowed', self.APP.allowed.get());
        //console.debug( 'haveProviders', self.APP.haveProviders.get());
    });
});

Template.client_new_button.helpers({
    // client new button parameters
    parmsPlusButton(){
        return {
            ...this,
            label: pwixI18n.label( I18N, 'clients.new.button_label' ),
            shape: PlusButton.C.Shape.RECTANGLE,
            title: pwixI18n.label( I18N, 'clients.new.button_title' ),
            enabled: Template.instance().APP.enabled
        }
    },
});

Template.client_new_button.events({
    'click .plusButton'( event, instance ){
        let dc = { ...this };
        delete dc.entityTabs;
        delete dc.entityTabsAfter;
        delete dc.recordTabs;
        delete dc.recordTabsAfter;
        delete dc.checker;
        Modal.run({
            ...dc,
            item: null,
            organization: this.item.get(),
            mdBody: 'client_new_assistant',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-xxl',
            mdTitle: pwixI18n.label( I18N, 'clients.new.assistant_title' )
        });
        return false;
    }
});
