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
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import { ClientProfile } from '/imports/common/definitions/client-profile.def.js';
import { ClientType } from '/imports/common/definitions/client-type.def.js';

import './client_new_assistant_client_type.html';

Template.client_new_assistant_client_type.onCreated( function(){
    const self = this;

    self.APP = {
        // whether this item is currently selected ?
        isSelected( it ){
            const typeId = Template.currentData().parentAPP.assistantStatus.get( 'client_type' ) || null;
            return typeId === ClientType.id( it );
        },

        // reactively update the record and the datadict
        setRecord( dataContext, type ){
            const recordRv = dataContext.parentAPP.entity.get().DYN.records[0];
            let record = recordRv.get();
            record.client_type = type;
            recordRv.set( record );
            dataContext.parentAPP.assistantStatus.set( 'client_type', type );
        }
    };
});

Template.client_new_assistant_client_type.onRendered( function(){
    const self = this;

    // set a default selection if the record doesn't have one
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        if( dataDict.get( 'activePane' ) === 'client' ){
            let client_type = dataDict.get( 'client_type' ) || null;
            if( !client_type ){
                const profile = dataDict.get( 'profile' ) || null;
                if( profile ){
                    const profileDef = ClientProfile.byId( profile );
                    if( profileDef ){
                        client_type = ClientProfile.defaultClientType( profileDef );
                        self.APP.setRecord( Template.currentData(), client_type );
                    }
                }
            }
        }
    });

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
        return Template.instance().APP.isSelected( it ) ? 'checked' : '';
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
        return Template.instance().APP.isSelected( it ) ? 'selected' : '';
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
    // client type selection reactively updates the record and set the assistantStatus ReactiveDict
    'click .by-item'( event, instance ){
        const id = instance.$( event.currentTarget ).data( 'item-id' );
        instance.APP.setRecord( this, id );
    }
});
