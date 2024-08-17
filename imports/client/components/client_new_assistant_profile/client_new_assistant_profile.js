/*
 * /imports/client/components/client_new_assistant_profile/client_new_assistant_profile.js
 *
 * Parms:
 * - parentAPP: the assistant APP whole object
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { pwixI18n } from 'meteor/pwix:i18n';

import { ClientProfile } from '/imports/common/definitions/client-profile.def.js';

import './client_new_assistant_profile.html';

Template.client_new_assistant_profile.onCreated( function(){
    //console.debug( 'Template.currentData()', Template.currentData());
    //Template.currentData().parentAPP.assistantStatus.set( 'profileId', null );
});

Template.client_new_assistant_profile.onRendered( function(){
    const self = this;

    // tracks the selection to enable/disable the Next button when the pane is active
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        if( dataDict.get( 'activePane' ) === 'profile' ){
            const profile = dataDict.get( 'profileId' );
            self.$( '.c-client-new-assistant-profile' ).trigger( 'assistant-do-action-set', { action: 'next', enable: Boolean( profile?.length ) });
        }
    });

    // tracks the selection for updating data and UI (doesn't depend of the current pane as soon as profileId changes)
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        const profile = dataDict.get( 'profileId' );
        // setup the selection appearance
        self.$( '.c-client-new-assistant-profile .by-item' ).removeClass( 'selected' );
        const entity = Template.currentData().parentAPP.entity.get();
        const index = 0;
        const record = entity.DYN.records[index].get();
        record.profile = profile;
        if( profile ){
            self.$( '.c-client-new-assistant-profile .by-item[data-item-id="'+profile+'"]' ).addClass( 'selected' );
            // setup dependant default values - must be done here so that other panes can modified them
            const def = ClientProfile.byId( profile );
            assert( def, 'ClientProfile definition is empty' );
            dataDict.set( 'profileDefinition', def );
            dataDict.set( 'profileFeatures', ClientProfile.defaultFeatures( def ));
            //dataDict.set( 'haveAllowedApis', ClientProfile.defaultHaveAllowedApis( def ));
            //dataDict.set( 'haveEndpoints', ClientProfile.defaultHaveEndpoints( def ));
            //dataDict.set( 'haveUsers', ClientProfile.defaultHaveUsers( def ));
            //record.clientyType = ClientProfile.defaultClientType( def );
            //record.grantTypes = ClientProfile.defaultGrantTypes( def );
            //record.authMethod = ClientProfile.defaultAuthMethod( def );
        }
    });

    // tracks the selection for updating data and UI (doesn't depend of the current pane as soon as profileId changes)
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        const haveEndpoints = Boolean( dataDict.get( 'haveEndpoints' ));
        self.$( '.c-client-new-assistant-profile' ).trigger( 'assistant-do-enable-tab', { name: 'endpoints', enabled: haveEndpoints });
    });
});

Template.client_new_assistant_profile.helpers({
    // internationalization
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // description
    itDescription( it ){
        return ClientProfile.description( it );
    },

    // identifier
    itId( it ){
        return ClientProfile.id( it );
    },

    // image
    itImage( it ){
        return ClientProfile.image( it );
    },

    // label
    itLabel( it ){
        return ClientProfile.label( it );
    },

    // items list
    itemsList(){
        return ClientProfile.Knowns();
    },

    // parms for current choices
    parmsCurrent(){
        return {
            parentAPP: this.parentAPP
        };
    }
});

Template.client_new_assistant_profile.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-client-new-assistant-profile'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: false });
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next',  enable: false });
    },
    'assistant-pane-shown .c-client-new-assistant-profile'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: true });
    },

    // profile selection
    'click .by-item'( event, instance ){
        const id = instance.$( event.currentTarget ).closest( '.by-item' ).data( 'item-id' );
        this.parentAPP.assistantStatus.set( 'profileId', id );
    }
});