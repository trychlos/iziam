/*
 * /imports/client/components/client_new_assistant_redirects/client_new_assistant_redirects.js
 *
 * We accept the client be defined without any redirect urls, though it will not be operational.
 *
 * Parms:
 * - parentAPP: the assistant APP whole object
 */

import _ from 'lodash';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import '/imports/client/components/client_redirects_panel/client_redirects_panel.js';

import './client_new_assistant_redirects.html';

Template.client_new_assistant_redirects.onCreated( function(){
    const self = this;

    self.APP = {
        valid: new ReactiveVar( false )
    };
});

Template.client_new_assistant_redirects.onRendered( function(){
    const self = this;

    // enable the Next button if the panel is valid
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        if( dataDict.get( 'activePane' ) === 'redirects' ){
            self.$( '.c-client-new-assistant-redirects' ).trigger( 'assistant-do-action-set', { action: 'next',  enable: self.APP.valid.get() });
        }
    });
});

Template.client_new_assistant_redirects.helpers({
    // internationalization
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for current choices
    parmsCurrent(){
        return {
            parentAPP: this.parentAPP
        };
    },

    // parms for Redirect URLs panel
    parmsRedirectsPanel(){
        return {
            ...this,
            entity: this.parentAPP.entity,
            index: 0,
            checker: this.parentAPP.assistantCheckerRv,
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
    'iz-status .c-client-new-assistant-redirects'( event, instance, data ){
        //console.debug( 'iz-status', data );
        instance.APP.valid.set( data.status === Forms.CheckStatus.C.VALID || data.status === Forms.CheckStatus.C.NONE );
    }
});
