/*
 * /imports/client/components/client_new_assistant_redirects/client_new_assistant_redirects.js
 *
 * We accept the client be defined without any redirect urls, though it will not be operational.
 *
 * Parms:
 * - parentAPP: the assistant APP whole object
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

import { GrantType } from '/imports/common/definitions/grant-type.def.js';

import '/imports/client/components/client_redirects_panel/client_redirects_panel.js';

import './client_new_assistant_redirects.html';

Template.client_new_assistant_redirects.onRendered( function(){
    const self = this;

    // tracks the selected providers to enable/disable this pane
    // this pane requires to have at least a grant type which implements a redirected grant flow
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        self.$( '.c-client-new-assistant-redirects' ).trigger( 'assistant-do-enable-tab', { name: 'redirects',  enabled: GrantType.wantRedirects( dataDict.get( 'grant_types' ) || [] ) });
    });
});

Template.client_new_assistant_redirects.helpers({
    // internationalization
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for Redirect URLs panel
    parmsRedirectsPanel(){
        return {
            ...this,
            entity: this.parentAPP.entity,
            index: 0,
            enableChecks: false
        };
    }
});

Template.client_new_assistant_redirects.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-client-new-assistant-redirects'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: false });
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next',  enable: false });
    },
    'assistant-pane-shown .c-client-new-assistant-redirects'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: true });
        instance.$( '.c-client-redirects-panel' ).trigger( 'iz-enable-checks', true );
    },
    // an event sent by client_redirects_panel to advertize of its status
    'iz-checker .c-client-new-assistant-redirects'( event, instance, data ){
        if( this.parentAPP.assistantStatus.get( 'activePane' ) === 'redirects' ){
            instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next', enable: data.validity });
        }
    }
});
