/*
 * /imports/client/components/client_new_assistant_summary/client_new_assistant_summary.js
 *
 *  Help the user to determine the nature of the client he is registering.
 */

import _ from 'lodash';

import './client_new_assistant_summary.html';

Template.client_new_assistant_summary.helpers({
    // parms for current choices
    parmsCurrent(){
        return {
            parentAPP: this.parentAPP,
            display: this.parentAPP.previousPanes()
        };
    }
});

Template.client_new_assistant_summary.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-client-new-assistant-properties'( event, instance, data ){
        console.debug( event.type, data );
        this.parentAPP.dataParts.set( 'prev', false );
        this.parentAPP.dataParts.set( 'next', false );
    },
    'assistant-pane-shown .c-client-new-assistant-properties'( event, instance, data ){
        console.debug( event.type, data );
        this.parentAPP.dataParts.set( 'prev', true );
        this.parentAPP.dataParts.set( 'next', true );
    },
});
