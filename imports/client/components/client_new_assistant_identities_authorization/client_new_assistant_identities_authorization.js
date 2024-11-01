/*
 * /imports/client/components/client_new_assistant_identities_authorization/client_new_assistant_identities_authorization.js
 *
 * Parms:
 * - parentAPP: the assistant APP whole object
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

import { GrantType } from '/imports/common/definitions/grant-type.def.js';

import '/imports/client/components/client_identity_access_mode_panel/client_identity_access_mode_panel.js';

import './client_new_assistant_identities_authorization.html';

Template.client_new_assistant_identities_authorization.onRendered( function(){
    const self = this;

    // tracks the grant flow to enable/disable this pane
    // only client credentials flow doesn't need any user interaction
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        const selected = dataDict.get( 'grant_types' ) || [];
        self.$( '.c-client-new-assistant-identities-authorization' ).trigger( 'assistant-do-enable-tab', { name: 'authorization', enabled: GrantType.hasResourceOwner( selected ) });
    });

    // tracks the current record to enable/disable the Next button when the pane is active
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        const entity = Template.currentData().parentAPP.entity.get();
        const record = entity.DYN.records[0].get();
        if( dataDict.get( 'activePane' ) === 'authorization' ){
            self.$( '.c-client-new-assistant-identities-authorization' ).trigger( 'assistant-do-action-set', { action: 'next', enable: Boolean( record.identity_access_mode )});
        }
    });
});

Template.client_new_assistant_identities_authorization.helpers({
    // internationalization
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for re-use the client_identity_auth_mode_panel panel
    parmsAuthorizationPanel(){
        return {
            ...this,
            entity: this.parentAPP.entity,
            index: 0,
            enableChecks: false
        };
    }
});

Template.client_new_assistant_identities_authorization.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-client-new-assistant-identities-authorization'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: false });
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next',  enable: false });
    },
    'assistant-pane-shown .c-client-new-assistant-identities-authorization'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: true });
        instance.$( '.c-client-properties-panel' ).trigger( 'iz-enable-checks', true );
    },
    // get the status of the panel checker
    'iz-checker .c-client-new-assistant-identities-authorization'( event, instance, data ){
        if( this.parentAPP.assistantStatus.get( 'activePane' ) === 'properties' ){
            instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next', enable: data.validity });
        }
    }
});
