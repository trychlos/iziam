/*
 * /imports/client/components/client_new_assistant_properties/client_new_assistant_properties.js
 *
 * Parms:
 * - parentAPP: the assistant APP whole object
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

import '/imports/client/components/client_properties_panel/client_properties_panel.js';

import './client_new_assistant_properties.html';

Template.client_new_assistant_properties.onRendered( function(){
    const self = this;

    // tracks the selection to enable/disable the Next button when the pane is active
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        if( dataDict.get( 'activePane' ) === 'properties' ){
            const label = Template.currentData().parentAPP.entity.get().DYN.records[0].get().label;
            self.$( '.c-client-new-assistant-properties' ).trigger( 'assistant-do-action-set', { action: 'next', enable: Boolean( label?.length ) });
        }
    });
});

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
            checker: this.parentAPP.assistantCheckerRv,
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
    }
});
