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
    const self = this;

    self.APP = {
        // whether this item is selected
        isSelected( it ){
            const profileId = Template.currentData().parentAPP.assistantStatus.get( 'profile' ) || null;
            return profileId === ClientProfile.id( it );
        },

        // reactively update the record and the datadict
        setRecord( dataContext, profile ){
            const recordRv = dataContext.parentAPP.entity.get().DYN.records[0];
            let record = recordRv.get();
            record.profile = profile;
            recordRv.set( record );
            dataContext.parentAPP.assistantStatus.set( 'profile', profile );
        }
    };
});

Template.client_new_assistant_profile.onRendered( function(){
    const self = this;

    // tracks the selection to enable/disable the Next button when the pane is active
    //  requires a selected profile
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        if( dataDict.get( 'activePane' ) === 'profile' ){
            const profileId = dataDict.get( 'profile' ) || null;
            self.$( '.c-client-new-assistant-profile' ).trigger( 'assistant-do-action-set', { action: 'next', enable: ( profileId !== null ) });
        }
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

    // is this item selected ?
    itSelected( it ){
        return Template.instance().APP.isSelected( it ) ? 'selected' : '';
    },

    // items list
    itemsList(){
        return ClientProfile.Knowns();
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
    // profile selection non-reactively updates the record and set the assistantStatus ReactiveDict
    'click .by-item'( event, instance ){
        const id = instance.$( event.currentTarget ).data( 'item-id' );
        instance.APP.setRecord( this, id );
    }
});
