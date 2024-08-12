/*
 * /imports/client/components/client_new_assistant_introduction/client_new_assistant_introduction.js
 *
 * Parms:
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import './client_new_assistant_introduction.html';

Template.client_new_assistant_introduction.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    }
});

Template.client_new_assistant_introduction.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-client-new-assistant-introduction'( event, instance, data ){
        console.debug( event.type, data );
        this.parentAPP.dataParts.set( 'prev', false );
        this.parentAPP.dataParts.set( 'next', false );
    },

    // we are expected to be able to act on the action buttons on 'show' and 'shown' events
    'assistant-pane-shown .c-client-new-assistant-introduction'( event, instance, data ){
        console.debug( event.type, data );
        this.parentAPP.dataParts.set( 'next', true );
    }
});
