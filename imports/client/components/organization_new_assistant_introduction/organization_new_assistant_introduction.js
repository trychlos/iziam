/*
 * /imports/client/components/organization_new_assistant_introduction/organization_new_assistant_introduction.js
 *
 * Parms:
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import './organization_new_assistant_introduction.html';

Template.organization_new_assistant_introduction.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    }
});

Template.organization_new_assistant_introduction.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-organization-new-assistant-introduction'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: false });
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next',  enable: false });
    },
    'assistant-pane-shown .c-organization-new-assistant-introduction'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next', enable: true });
    }
});
