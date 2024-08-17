/*
 * /imports/client/components/client_new_assistant_providers/client_new_assistant_providers.js
 *
 * Parms:
 * - parentAPP: the assistant APP whole object
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { pwixI18n } from 'meteor/pwix:i18n';

import { ClientProfile } from '/imports/common/definitions/client-profile.def.js';

import { Clients } from '/imports/common/collections/clients/index.js';

import '/imports/client/components/client_providers_panel/client_providers_panel.js';

import './client_new_assistant_providers.html';

Template.client_new_assistant_providers.onCreated( function(){
    //console.debug( 'Template.currentData()', Template.currentData());
    //Template.currentData().parentAPP.assistantStatus.set( 'profileId', null );
});

Template.client_new_assistant_providers.onRendered( function(){
    const self = this;

    // tracks the selection for updating data and UI
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        /*
        const profile = dataDict.get( 'profileId' );
        // setup the selection appearance
        self.$( '.c-client-new-assistant-profile .by-item' ).removeClass( 'selected' );
        if( profile ){
            self.$( '.c-client-new-assistant-profile .by-item[data-item-id="'+profile+'"]' ).addClass( 'selected' );
            // setup dependant default values - must be done here so that other panes can modified them
            const entity = Template.currentData().parentAPP.entity.get();
            const index = 0;
            const record = entity.DYN.records[index].get();
            const def = ClientProfile.byId( profile );
            assert( def, 'ClientProfile definition is empty' );
            dataDict.set( 'profileDefinition', def );
            dataDict.set( 'haveAllowedApis', ClientProfile.defaultHaveAllowedApis( def ));
            dataDict.set( 'haveEndpoints', ClientProfile.defaultHaveEndpoints( def ));
            dataDict.set( 'haveUsers', ClientProfile.defaultHaveUsers( def ));
            record.clientyType = ClientProfile.defaultClientType( def );
            record.grantTypes = ClientProfile.defaultGrantTypes( def );
            record.authMethod = ClientProfile.defaultAuthMethod( def );
        }
            */
    });

    // track the selection
    self.autorun(() => {
        const parentAPP = Template.currentData().parentAPP;
        const args = {
            caller: {
                entity: parentAPP.entity.get(),
                record: parentAPP.entity.get().DYN.records[0].get()
            },
            parent: Template.currentData().organization
        };
        //console.debug( args, Clients.fn.selectedProvidersGet( args ));
    });
});

Template.client_new_assistant_providers.helpers({
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

    // parms for re-use the client_edit providers panel
    parmsProvidersPanel(){
        return {
            ...this,
            entity: this.parentAPP.entity,
            index: 0,
            checker: this.parentAPP.checker,
            enableChecks: false
        };
    }
});

Template.client_new_assistant_providers.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-client-new-assistant-providers'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: false });
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next',  enable: false });
    },
    // we can continue even if we do not have any selected provider
    //  we will not have any grant type, nor auth method or anything, but we can have a client Id and edit it later
    'assistant-pane-shown .c-client-new-assistant-providers'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: true });
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next', enable: true });
    }
});
