/*
 * /imports/client/components/organization_new_assistant_properties/organization_new_assistant_properties.js
 *
 * Parms:
 * - parentAPP: the assistant APP whole object
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import '/imports/client/components/organization_properties_panel/organization_properties_panel.js';

import './organization_new_assistant_properties.html';

Template.organization_new_assistant_properties.helpers({
    // internationalization
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for re-use the organization_edit properties panel
    parmsPropertiesPanel(){
        return {
            ...this,
            entity: this.parentAPP.entity,
            index: 0,
            enableChecks: false
        };
    }
});

Template.organization_new_assistant_properties.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-organization-new-assistant-properties'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: false });
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next',  enable: false });
    },
    'assistant-pane-shown .c-organization-new-assistant-properties'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: true });
        console.debug( 'triggering iz-enable-checks' );
        instance.$( '.c-organization-properties-panel' ).trigger( 'iz-enable-checks', true );
    },
    // get the status of the panel checker
    'iz-checker .c-organization-new-assistant-properties'( event, instance, data ){
        console.debug( event.type, data );
        if( this.parentAPP.assistantStatus.get( 'activePane' ) === 'properties' ){
            instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next', enable: data.validity });
        } else {
            console.debug( 'not the properties pane' );
        }
    }
});