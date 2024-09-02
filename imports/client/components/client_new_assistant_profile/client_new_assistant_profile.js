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

Template.client_new_assistant_profile.onRendered( function(){
    const self = this;

    // tracks the selection to enable/disable the Next button when the pane is active
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        if( dataDict.get( 'activePane' ) === 'profile' ){
            const profileDef = dataDict.get( 'profileDef' ) || null;
            self.$( '.c-client-new-assistant-profile' ).trigger( 'assistant-do-action-set', { action: 'next', enable: ( profileDef !== null ) });
        }
    });

    // tracks the selection for updating data and UI
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        const profileDef = dataDict.get( 'profileDef' );
        // setup the selection appearance
        self.$( '.c-client-new-assistant-profile .by-item' ).removeClass( 'selected' );
        if( profileDef ){
            self.$( '.c-client-new-assistant-profile .by-item[data-item-id="'+ClientProfile.id( profileDef )+'"]' ).addClass( 'selected' );
            // setup dependant default values - must be done here so that other panes can modified them
            dataDict.set( 'profileFeatures', ClientProfile.defaultFeatures( profileDef ));
            dataDict.set( 'clientType', ClientProfile.defaultClientType( profileDef ));
            //dataDict.set( 'haveAllowedApis', ClientProfile.defaultHaveAllowedApis( def ));
            //dataDict.set( 'haveEndpoints', ClientProfile.defaultHaveEndpoints( def ));
            //dataDict.set( 'haveUsers', ClientProfile.defaultHaveUsers( def ));
        }
    });

    // tracks the selection for updating data and UI (doesn't depend of the current pane as soon as profileId changes)
    /*
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        const haveEndpoints = Boolean( dataDict.get( 'haveEndpoints' ));
        self.$( '.c-client-new-assistant-profile' ).trigger( 'assistant-do-enable-tab', { name: 'endpoints', enabled: haveEndpoints });
    });
    */
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
        const def = ClientProfile.byId( id );
        this.parentAPP.assistantStatus.set( 'profileDef', def );
    },
    // on Next, non-reactively feed the record
    'assistant-action-next .c-client-new-assistant-profile'( event, instance ){
        const record = this.parentAPP.entity.get().DYN.records[0].get();
        const profileDef = this.parentAPP.assistantStatus.get( 'profileDef' );
        record.profile = profileDef ? ClientProfile.id( profileDef ) : null;
    }
});
