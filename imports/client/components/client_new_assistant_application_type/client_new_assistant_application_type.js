/*
 * /imports/client/components/client_new_assistant_application_type/client_new_assistant_application_type.js
 *
 * OpenID Connect says that applicaiton_type defaults to 'web'
 *
 * Parms:
* - parentAPP: the assistant APP whole object
*/

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import { ApplicationType } from '/imports/common/definitions/application-type.def.js';

import './client_new_assistant_application_type.html';

Template.client_new_assistant_application_type.onCreated( function(){
    const self = this;

    self.APP = {
        // whether this item is currently selected ?
        isSelected( it ){
            const typeId = Template.currentData().parentAPP.assistantStatus.get( 'application_type' ) || null;
            return typeId === ApplicationType.id( it );
        },

        // reactively update the record and the datadict
        setRecord( dataContext, type ){
            const recordRv = dataContext.parentAPP.entity.get().DYN.records[0];
            let record = recordRv.get();
            record.application_type = type;
            recordRv.set( record );
            dataContext.parentAPP.assistantStatus.set( 'application_type', type );
        }
    };
});

Template.client_new_assistant_application_type.onRendered( function(){
    const self = this;

    // setup a default value to 'web'
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        if( dataDict.get( 'activePane' ) === 'application' ){
            const type = Template.currentData().parentAPP.entity.get().DYN.records[0].get().application_type;
            if( !type ){
                self.APP.setRecord( Template.currentData(), 'web' );
            }
        }
    });

    // tracks the selection to enable/disable the Next button when the pane is active
    //  selection is not mandatory here
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        if( dataDict.get( 'activePane' ) === 'application' ){
            const application_type = dataDict.get( 'application_type' ) || null;
            self.$( '.c-client-new-assistant-application-type' ).trigger( 'assistant-do-action-set', { action: 'next',  enable: application_type !== null });
        }
    });
});

Template.client_new_assistant_application_type.helpers({
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
        return ApplicationType.description( it );
    },

    // identifier
    itId( it ){
        return ApplicationType.id( it );
    },

    // label
    itLabel( it ){
        return ApplicationType.label( it );
    },

    // whether this item is selected ?
    itSelected( it ){
        return Template.instance().APP.isSelected( it ) ? 'selected' : '';
    },

    // items list
    itemsList(){
        return ApplicationType.Knowns();
    }
});

Template.client_new_assistant_application_type.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-client-new-assistant-application-type'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: false });
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'next',  enable: false });
    },
    'assistant-pane-shown .c-client-new-assistant-application-type'( event, instance, data ){
        instance.$( event.currentTarget ).trigger( 'assistant-do-action-set', { action: 'prev', enable: true });
    },
    // application type selection reactively updates the record and set the assistantStatus ReactiveDict
    'click .by-item'( event, instance ){
        const id = instance.$( event.currentTarget ).data( 'item-id' );
        instance.APP.setRecord( this, id );
    }
});
