/*
 * /imports/client/components/organization_new_assistant_summary/organization_new_assistant_summary.js
 *
 * All panes of the assistant have been completed.
 * This is a last summary before actual organization creation.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import './organization_new_assistant_summary.html';

Template.organization_new_assistant_summary.helpers({
    // internationalization
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    }
});

Template.organization_new_assistant_summary.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-organization-new-assistant-summary'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: false });
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next',  enable: false });
    },
    'assistant-pane-shown .c-organization-new-assistant-summary'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: true });
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next',  enable: true });
    },
});
