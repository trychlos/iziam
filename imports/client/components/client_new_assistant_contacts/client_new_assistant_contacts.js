/*
 * /imports/client/components/client_new_assistant_contacts/client_new_assistant_contacts.js
 *
 * We accept the client be defined without any redirect urls, though it will not be operational.
 *
 * Parms:
 * - parentAPP: the assistant APP whole object
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

import '/imports/client/components/client_contacts_panel/client_contacts_panel.js';

import './client_new_assistant_contacts.html';

Template.client_new_assistant_contacts.helpers({
    // internationalization
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for Redirect URLs panel
    parmsContactsPanel(){
        return {
            ...this,
            entity: this.parentAPP.entity,
            index: 0,
            enableChecks: false
        };
    }
});

Template.client_new_assistant_contacts.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-client-new-assistant-contacts'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: false });
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next',  enable: false });
    },
    'assistant-pane-shown .c-client-new-assistant-contacts'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: true });
        instance.$( '.c-client-contacts-panel' ).trigger( 'iz-enable-checks', true );
    },
    // an event sent by client_contacts_panel to advertise of its status
    'iz-checker .c-client-new-assistant-contacts'( event, instance, data ){
        if( this.parentAPP.assistantStatus.get( 'activePane' ) === 'contacts' ){
            console.debug( data );
            self.$( '.c-client-new-assistant-contacts' ).trigger( 'assistant-do-action-set', { action: 'next',  enable: data.validity });
        }
    }
});
