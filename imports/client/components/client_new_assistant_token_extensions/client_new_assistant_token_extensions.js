/*
 * /imports/client/components/client_new_assistant_token_extensions/client_new_assistant_token_extensions.js
 *
 * Grant types are selectable by nature of grant type:
 * - one for the access token
 * - maybe one for the refresh token
 * - maybe several for the token formaters
 * 
 * Grant types are only selectables when at least one provider has been chosen.
 * In other words, this pane is only enabled when there is at least one selected provider.
 *
 * Parms:
* - parentAPP: the assistant APP whole object
*/

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

import '/imports/client/components/client_token_extensions_panel/client_token_extensions_panel.js';

import './client_new_assistant_token_extensions.html';

Template.client_new_assistant_token_extensions.onCreated( function(){
    const self = this;

    self.APP = {
        // the selectables grant types
        // computed by the embedded component, passed-in via iz-token-extensions event
        selectables: null
    };
});

Template.client_new_assistant_token_extensions.helpers({
    // internationalization
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for grant types panel
    parmsTokenExtensions(){
        return {
            ...this,
            entity: this.parentAPP.entity,
            index: 0,
            enableChecks: false
        }
    }
});

Template.client_new_assistant_token_extensions.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-client-new-assistant-token-extensions'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: false });
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next',  enable: false });
    },
    'assistant-pane-shown .c-client-new-assistant-token-extensions'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: true });
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next', enable: true });
    },
    // be kept informed of the changes
    'iz-token-extensions .c-client-new-assistant-token-extensions'( event, instance, data ){
        this.parentAPP.assistantStatus.set( 'token_extensions', data.token_extensions );
    },
    'iz-selectables .c-client-new-assistant-token-extensions'( event, instance, data ){
        instance.APP.selectables = data.selectables;
    }
});
