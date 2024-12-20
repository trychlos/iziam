/*
 * /imports/client/components/client_new_assistant_summary/client_new_assistant_summary.js
 *
 * All panes of the assistant have been completed.
 * This is a last summary before actual client creation.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import './client_new_assistant_summary.html';

Template.client_new_assistant_summary.helpers({
    // internationalization
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    }
});

Template.client_new_assistant_summary.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-client-new-assistant-summary'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: false });
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next',  enable: false });
    },
    'assistant-pane-shown .c-client-new-assistant-summary'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: true });
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next',  enable: true });
    },
});
