/*
 * /imports/client/components/client_new_assistant_grant_types/client_new_assistant_grant_types.js
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
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import { GrantType } from '/imports/common/definitions/grant-type.def.js';

import { Providers } from '/imports/common/tables/providers/index.js';

import '/imports/client/components/client_grant_types_panel/client_grant_types_panel.js';

import './client_new_assistant_grant_types.html';

Template.client_new_assistant_grant_types.onCreated( function(){
    const self = this;

    self.APP = {
        // the selectables grant types
        // computed by the embedded component, passed-in via iz-grant-types event
        selectables: null
    };
});

Template.client_new_assistant_grant_types.onRendered( function(){
    const self = this;

    // tracks the selected providers to enable/disable this pane
    // this "grant types" pane requires to have a provider for oauth2 feature
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        const selected = dataDict.get( 'selectedProviders' ) || [];
        self.$( '.c-client-new-assistant-grant-types' ).trigger( 'assistant-do-enable-tab', { name: 'grant', enabled: Providers.hasFeature( selected, 'oauth2' ) });
    });

    // tracks the selection to enable/disable the Next button when the pane is active
    // the grant natures which have a mandatory nature must be set
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        if( dataDict.get( 'activePane' ) === 'grant' ){
            const array = dataDict.get( 'grant_types' ) || [];
            self.$( '.c-client-new-assistant-grant-types' ).trigger( 'assistant-do-action-set', { action: 'next', enable: GrantType.isValidSelection( self.APP.selectables, array )});
        }
    });
});

Template.client_new_assistant_grant_types.helpers({
    // internationalization
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for grant types panel
    parmsGrantType(){
        return {
            ...this,
            entity: this.parentAPP.entity,
            index: 0,
            enableChecks: false
        }
    }
});

Template.client_new_assistant_grant_types.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-client-new-assistant-grant-types'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: false });
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next',  enable: false });
    },
    'assistant-pane-shown .c-client-new-assistant-grant-types'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: true });
        instance.$( '.c-client-grant-types-panel' ).trigger( 'iz-enable-checks', true );
    },
    // be kept informed of the changes
    'iz-grant-types .c-client-new-assistant-grant-types'( event, instance, data ){
        this.parentAPP.assistantStatus.set( 'grant_types', data.grant_types );
    },
    'iz-selectables .c-client-new-assistant-grant-types'( event, instance, data ){
        instance.APP.selectables = data.selectables;
    }
});
