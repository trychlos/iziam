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
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: false });
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next',  enable: false });
    },
    'assistant-pane-shown .c-client-new-assistant-introduction'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next', enable: true });
    }
});
