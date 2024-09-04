/*
 * /imports/client/components/client_new_assistant_client_type/client_new_assistant_client_type.js
 *
 * The client type comes from the chosen client profile.
 * The assistant lets the user changes it if needed
 *
 * Parms:
* - parentAPP: the assistant APP whole object
*/

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

import { ClientType } from '/imports/common/definitions/client-type.def.js';

import './client_new_assistant_client_type.html';

Template.client_new_assistant_client_type.onRendered( function(){
    const self = this;

    // tracks the selection to enable/disable the Next button when the pane is active
    //  must have a selection
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        if( dataDict.get( 'activePane' ) === 'client' ){
            const client_type = dataDict.get( 'client_type' ) || null;
            self.$( '.c-client-new-assistant-client-type' ).trigger( 'assistant-do-action-set', { action: 'next',  enable: client_type !== null });
        }
    });
});

Template.client_new_assistant_client_type.helpers({
    // internationalization
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // whether this item is selected ?
    itChecked( it ){
        const id = ClientType.id( it );
        return this.parentAPP.assistantStatus.get( 'client_type' ) === id ? 'checked' : '';
    },

    // description
    itDescription( it ){
        return ClientType.description( it );
    },

    // identifier
    itId( it ){
        return ClientType.id( it );
    },

    // label
    itLabel( it ){
        return ClientType.label( it );
    },

    // whether this item is selected ?
    itSelected( it ){
        const id = ClientType.id( it );
        return this.parentAPP.assistantStatus.get( 'client_type' ) === id ? 'selected' : '';
    },

    // items list
    itemsList(){
        return ClientType.Knowns();
    }
});

Template.client_new_assistant_client_type.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-client-new-assistant-client-type'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: false });
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next',  enable: false });
    },
    'assistant-pane-shown .c-client-new-assistant-client-type'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: true });
    },
    // intercept the selection, updating the client type
    // changing the client type implies clearing auth method and grant types
    'click .js-check'( event, instance ){
        const id = instance.$( event.currentTarget ).prop( 'id' );
        this.parentAPP.assistantStatus.set( 'client_type', id );
    },
    // on Next, non-reactively feed the record
    'assistant-action-next .c-client-new-assistant-client-type'( event, instance ){
        const record = this.parentAPP.entity.get().DYN.records[0].get();
        record.client_type = this.parentAPP.assistantStatus.get( 'client_type' );
    }
});
