/*
 * /imports/client/components/organization_new_assistant_rest/organization_new_assistant_rest.js
 *
 * Parms:
 * - parentAPP: the assistant APP whole object
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import '/imports/client/components/organization_config_rest_pane/organization_config_rest_pane.js';

import './organization_new_assistant_rest.html';

Template.organization_new_assistant_rest.onRendered( function(){
    const self = this;

    // tracks the selection to enable/disable the Next button when the pane is active
    //  selection is not mandatory here
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        if( dataDict.get( 'activePane' ) === 'rest' ){
            const validity = Template.currentData().checker.get().validity();
            self.$( '.c-organization-new-assistant-rest' ).trigger( 'assistant-do-action-set', { action: 'next',  enable: validity });
        }
    });
});

Template.organization_new_assistant_rest.helpers({
    // internationalization
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for re-use the organization_config_rest panel
    parmsRestPanel(){
        return {
            ...this,
            entity: this.parentAPP.entity,
            index: 0,
            enableChecks: false
        };
    }
});

Template.organization_new_assistant_rest.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-organization-new-assistant-rest'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: false });
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next',  enable: false });
    },
    'assistant-pane-shown .c-organization-new-assistant-rest'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: true });
        instance.$( '.c-organization-config-rest-pane' ).trigger( 'iz-enable-checks', true );
    }
});
