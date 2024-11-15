/*
 * /imports/client/components/client_new_assistant_logout/client_new_assistant_logout.js
 *
 * We accept the client be defined without any post-logout redirect urls.
 *
 * Parms:
 * - parentAPP: the assistant APP whole object
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import { GrantType } from '/imports/common/definitions/grant-type.def.js';

import '/imports/client/components/client_logout_redirects_panel/client_logout_redirects_panel.js';

import './client_new_assistant_logout.html';

Template.client_new_assistant_logout.onCreated( function(){
    const self = this;

    self.APP = {
        enabled: new ReactiveVar( false )
    };
});

Template.client_new_assistant_logout.onRendered( function(){
    const self = this;

    // this pane can be disabled when no resource owner (no user) is involved
    // only client credentials flow doesn't need any user interaction
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        const selected = dataDict.get( 'grant_types' ) || [];
        self.$( '.c-client-new-assistant-logout' ).trigger( 'assistant-do-enable-tab', { name: 'logout', enabled: GrantType.hasResourceOwner( selected ) });
    });
});

Template.client_new_assistant_logout.helpers({
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
            enableChecks: false,
            haveOne: Template.instance().APP.enabled.get()
        };
    }
});

Template.client_new_assistant_logout.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-client-new-assistant-logout'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: false });
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next',  enable: false });
    },
    'assistant-pane-shown .c-client-new-assistant-logout'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: true });
        instance.$( '.c-client-logout-redirects-panel' ).trigger( 'iz-enable-checks', true );
    },
    // an event sent by client_logout_panel to advertise of its status
    'iz-checker .c-client-new-assistant-logout'( event, instance, data ){
        if( this.parentAPP.assistantStatus.get( 'activePane' ) === 'logout' ){
            instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next', enable: data.validity });
        }
    }
});
