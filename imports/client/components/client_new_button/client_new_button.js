/*
 * /imports/client/components/client_new_button/client_new_button.js
 *
 * Let the organization manager define a new client.
 *
 * Parms:
 *  - checker
 *  - item
 *  - plus all plusButton parameters will be passed through
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

    self.APP = {
        canCreate: new ReactiveVar( false )
    };

    // check the creation permission
    self.autorun( async () => {
        self.APP.canCreate.set( await Permissions.isAllowed( 'feat.clients.new', Meteor.userId(), Template.currentData().item.get()._id ));
    });

    // track the creation permission
    self.autorun( async () => {
        //console.debug( 'canCreate', self.APP.canCreate.get());
    });
});

Template.client_new_button.helpers({
    // whether the user is allowed to create a new tenant
    canCreate(){
        return Template.instance().APP.canCreate.get();
    }
});

Template.client_new_button.events({
    'click .plusButton'( event, instance ){
        Modal.run({
            ...this,
            organization: this.item,
            mdBody: 'client_new_assistant',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-xl',
            mdClassesContent: Meteor.APP.runContext.pageUIClasses().join( ' ' ),
            mdTitle: pwixI18n.label( I18N, 'clients.new.assistant_title' ),
            item: null
        });
        return false;
    }
});
