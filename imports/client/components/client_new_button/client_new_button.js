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
        allowed: new ReactiveVar( false ),
        organization: new ReactiveVar( null ),
        haveProviders: new ReactiveVar( false ),
        enabled: new ReactiveVar( false )
    };

    // check the creation permission
    self.autorun( async () => {
        self.APP.allowed.set( await Permissions.isAllowed( 'feat.clients.create', Meteor.userId(), Template.currentData().item.get()._id ));
    });

    // build the organization { entity, record } object
    self.autorun(() => {
        const item = Template.currentData().item.get();
        self.APP.organization.set({
            entity: item,
            record: item.DYN.closest
        });
    });

    // must have providers
    self.autorun(() => {
        const organization = self.APP.organization.get();
        self.APP.haveProviders.set( organization.record.selectedProviders && _.isArray( organization.record.selectedProviders ) && organization.record.selectedProviders.length );
    });

    // enable the PlusButton
    self.autorun(() => {
        self.APP.enabled.set( self.APP.allowed.get() && self.APP.haveProviders.get());
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
            organization: instance.APP.organization.get(),
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
