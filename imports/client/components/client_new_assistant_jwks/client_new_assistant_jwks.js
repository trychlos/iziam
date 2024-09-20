/*
 * /imports/client/components/client_new_assistant_jwks/client_new_assistant_jwks.js
 *
 * We accept the client be defined without any redirect urls, though it will not be operational.
 *
 * Parms:
 * - parentAPP: the assistant APP whole object
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

import '/imports/client/components/client_jwks_panel/client_jwks_panel.js';

import './client_new_assistant_jwks.html';

Template.client_new_assistant_jwks.helpers({
    // internationalization
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for the jwks edit panel
    parmsJwksPanel(){
        return {
            ...this,
            entity: this.parentAPP.entity,
            index: 0
        };
    }
});

Template.client_new_assistant_jwks.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-client-new-assistant-jwks'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: false });
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next',  enable: false });
    },
    'assistant-pane-shown .c-client-new-assistant-jwks'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: true });
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next', enable: true });
        instance.$( '.c-client-jwks-panel' ).trigger( 'iz-enable-checks', true );
    }
});
