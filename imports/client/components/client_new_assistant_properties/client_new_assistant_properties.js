/*
 * /imports/client/components/client_new_assistant_properties/client_new_assistant_properties.js
 *
 * Parms:
 * - parentAPP: the assistant APP whole object
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import '/imports/client/components/client_properties_panel/client_properties_panel.js';

import './client_new_assistant_properties.html';

Template.client_new_assistant_properties.helpers({
    // internationalization
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for re-use the client_edit properties panel
    parmsPropertiesPanel(){
        return {
            ...this,
            entity: this.parentAPP.entity,
            index: 0,
            enableChecks: false
        };
    }
});

Template.client_new_assistant_properties.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-client-new-assistant-properties'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: false });
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next',  enable: false });
    },
    'assistant-pane-shown .c-client-new-assistant-properties'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: true });
        instance.$( '.c-client-properties-panel' ).trigger( 'iz-enable-checks', true );
    },
    // get the status of the panel checker
    'iz-checker .c-client-new-assistant-properties'( event, instance, data ){
        if( this.parentAPP.assistantStatus.get( 'activePane' ) === 'properties' ){
            instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next', enable: data.validity });
        }
    }
});
