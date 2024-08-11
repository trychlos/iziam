/*
 * /imports/client/components/client_new_assistant_introduction/client_new_assistant_introduction.js
 *
 * Parms:
 * - parentAPP: the assistant APP whole object
 */

import './client_new_assistant_introduction.html';

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
