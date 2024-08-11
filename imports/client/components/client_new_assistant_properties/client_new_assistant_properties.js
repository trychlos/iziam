/*
 * /imports/client/components/client_new_assistant_properties/client_new_assistant_properties.js
 *
 * Parms:
 * - parentAPP: the assistant APP whole object
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

import './client_new_assistant_properties.html';

Template.client_new_assistant_properties.onRendered( function(){
    const self = this;

    // tracks the selection to enable/disable the Next button when the pane is active
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.dataParts;
        if( dataDict.get( 'activePane' ) === 'properties' ){
            const name = dataDict.get( 'name' );
            dataDict.set( 'next', Boolean( name?.length ));
        }
    });

    // tracks the selection for updating data and UI (doesn't depend of the current pane as soon as natureId changes)
    self.autorun(() => {
    });
});

Template.client_new_assistant_properties.helpers({
    // internationalization
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for current choices
    parmsCurrent(){
        return {
            parentAPP: this.parentAPP,
            display: this.parentAPP.previousPanes()
        };
    },

    // parms for re-use the client_edit properties panel
    parmsPropertiesPanel(){
        return {
            item: this.parentAPP.item,
            entityChecker: this.parentAPP.entityChecker
        };
    }
});

Template.client_new_assistant_properties.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-client-new-assistant-properties'( event, instance, data ){
        console.debug( event.type, data );
        this.parentAPP.dataParts.set( 'prev', false );
        this.parentAPP.dataParts.set( 'next', false );
    },
    'assistant-pane-shown .c-client-new-assistant-properties'( event, instance, data ){
        console.debug( event.type, data );
        this.parentAPP.dataParts.set( 'prev', true );
    },
    // we embed the client_properties_panel which itself uses a FormChecker
    //  so the item is already up to date - Thanks to FormChecker
    //  manage here the Next action
    'panel-data .c-client-new-assistant-properties'( event, instance, data ){

    }
});
