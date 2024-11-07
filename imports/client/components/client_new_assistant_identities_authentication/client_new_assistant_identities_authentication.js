/*
 * /imports/client/components/client_new_assistant_identities_authentication/client_new_assistant_identities_authentication.js
 *
 * Parms:
 * - parentAPP: the assistant APP whole object
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import { GrantType } from '/imports/common/definitions/grant-type.def.js';

import '/imports/client/components/client_identity_auth_mode_panel/client_identity_auth_mode_panel.js';

import './client_new_assistant_identities_authentication.html';

Template.client_new_assistant_identities_authentication.onRendered( function(){
    const self = this;

    // tracks the grant type to enable/disable this pane
    // only client credentials flow doesn't need any user interaction
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        const selected = dataDict.get( 'grant_types' ) || [];
        self.$( '.c-client-new-assistant-identities-authentication' ).trigger( 'assistant-do-enable-tab', { name: 'authentication', enabled: GrantType.hasResourceOwner( selected ) });
    });

    // tracks the current record to enable/disable the Next button when the pane is active
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        if( dataDict.get( 'activePane' ) === 'authentication' ){
            const entity = Template.currentData().parentAPP.entity.get();
            const record = entity.DYN.records[0].get();
            self.$( '.c-client-new-assistant-identities-authentication' ).trigger( 'assistant-do-action-set', { action: 'next', enable: Boolean( record.identity_auth_mode )});
        }
    });
});

Template.client_new_assistant_identities_authentication.helpers({
    // internationalization
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for re-use the client_edit properties panel
    parmsAuthenticationPanel(){
        return {
            ...this,
            entity: this.parentAPP.entity,
            index: 0,
            enableChecks: false
        };
    }
});

Template.client_new_assistant_identities_authentication.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-client-new-assistant-identities-authentication'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: false });
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next',  enable: false });
    },
    'assistant-pane-shown .c-client-new-assistant-identities-authentication'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: true });
        instance.$( '.c-client-properties-panel' ).trigger( 'iz-enable-checks', true );
    },
    // get the status of the panel checker
    'iz-checker .c-client-new-assistant-identities-authentication'( event, instance, data ){
        if( this.parentAPP.assistantStatus.get( 'activePane' ) === 'properties' ){
            instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next', enable: data.validity });
        }
    }
});
