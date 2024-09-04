/*
 * /imports/client/components/client_new_assistant_auth_method/client_new_assistant_auth_method.js
 *
 * An authentication method is required for confidential clients.
 * But public clients also pass on this pane to see the 'none' auth method.
 *
 * Parms:
 * - parentAPP: the assistant APP whole object
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

import { Providers } from '/imports/common/collections/providers/index.js';

import { ClientProfile } from '/imports/common/definitions/client-profile.def.js';
import { ClientType } from '/imports/common/definitions/client-type.def.js';

import '/imports/client/components/client_auth_method_panel/client_auth_method_panel.js';

import './client_new_assistant_auth_method.html';

Template.client_new_assistant_auth_method.onCreated( function(){
    const self = this;

    self.APP = {
        selectables: new ReactiveVar( [] )
    };

    // set the selectables auth methods list
    // they depend of the client type, may be superseded by the client profile
    self.autorun(() => {
        const clientType = Template.currentData().parentAPP.assistantStatus.get( 'client_type' );
        const profileDef = Template.currentData().parentAPP.assistantStatus.get( 'profileDef' );
        if( clientType && profileDef ){
            let selectables = ClientProfile.defaultAuthMethods( profileDef );
            if( !selectables ){
                typeDef = ClientType.byId( clientType );
                if( typeDef ){
                    selectables = ClientType.defaultAuthMethods( typeDef );
                }
            }
            self.APP.selectables.set( selectables );
        }
    });
});

Template.client_new_assistant_auth_method.onRendered( function(){
    const self = this;

    // tracks the selected providers to enable/disable this pane
    // this "auth method" pane requires to have a provider for oauth2 feature
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        const selected = dataDict.get( 'selectedProviders' ) || [];
        self.$( '.c-client-new-assistant-auth-method' ).trigger( 'assistant-do-enable-tab', { name: 'auth',  enabled: Providers.hasFeature( selected, 'oauth2' ) });
    });

    // tracks the selection to enable/disable the Next button when the pane is active
    // an auth method must be set
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        if( dataDict.get( 'activePane' ) === 'auth' ){
            const authMethod = dataDict.get( 'token_endpoint_auth_method' ) || null;
            self.$( '.c-client-new-assistant-auth-method' ).trigger( 'assistant-do-action-set', { action: 'next',  enable: authMethod !== null });
        }
    });
});

Template.client_new_assistant_auth_method.helpers({
    // the context text depends of the current client_type
    content_text(){
        const clientType = this.parentAPP.assistantStatus.get( 'client_type' );
        return pwixI18n.label( I18N, clientType === 'confidential' ? 'clients.new_assistant.auth_method_confidential_text' : 'clients.new_assistant.auth_method_public_text' );
    },

    // internationalization
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for auth method panel
    parmsAuthMethod(){
        return {
            ...this,
            entity: this.parentAPP.entity,
            index: 0,
            checker: this.parentAPP.assistantCheckerRv,
            enableChecks: false,
            selectables: Template.instance().APP.selectables.get()
        };
    }
});

Template.client_new_assistant_auth_method.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-client-new-assistant-auth-method'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: false });
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next',  enable: false });
    },
    'assistant-pane-shown .c-client-new-assistant-auth-method'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: true });
    },
    // the panel advertizes of its current selection
    'iz-auth-method .c-client-new-assistant-auth-method'( event, instance, data ){
        this.parentAPP.assistantStatus.set( 'token_endpoint_auth_method', data.auth_method );
    }
});
