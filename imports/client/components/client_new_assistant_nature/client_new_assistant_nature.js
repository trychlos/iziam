/*
 * /imports/client/components/client_new_assistant_nature/client_new_assistant_nature.js
 *
 * Parms:
 * - parentAPP: the assistant APP whole object
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { pwixI18n } from 'meteor/pwix:i18n';

import { ClientNature } from '/imports/common/definitions/client-nature.def.js';

import './client_new_assistant_nature.html';

Template.client_new_assistant_nature.onCreated( function(){
    //console.debug( 'Template.currentData()', Template.currentData());
    Template.currentData().parentAPP.dataParts.set( 'natureId', null );
});

Template.client_new_assistant_nature.onRendered( function(){
    const self = this;

    // tracks the selection to enable/disable the Next button when the pane is active
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.dataParts;
        if( dataDict.get( 'activePane' ) === 'nature' ){
            const nature = dataDict.get( 'natureId' );
            console.debug( )
            dataDict.set( 'next', Boolean( nature?.length ));
        }
    });

    // tracks the selection for updating data and UI (doesn't depend of the current pane as soon as natureId changes)
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.dataParts;
        const nature = dataDict.get( 'natureId' );
        // setup the selection appearance
        self.$( '.c-client-new-assistant-nature .by-item' ).removeClass( 'selected' );
        if( nature ){
            self.$( '.c-client-new-assistant-nature .by-item[data-item-id="'+nature+'"]' ).addClass( 'selected' );
            // setup dependant default values - must be done here so that other panes can modified them
            const item = Template.currentData().parentAPP.item.get();
            const def = ClientNature.byId( nature );
            assert( def, 'CientNature definition is empty' );
            dataDict.set( 'natureDefinition', def );
            dataDict.set( 'haveAllowedApis', ClientNature.defaultHaveAllowedApis( def ));
            dataDict.set( 'haveEndpoints', ClientNature.defaultHaveEndpoints( def ));
            dataDict.set( 'haveUsers', ClientNature.defaultHaveUsers( def ));
            item.grantTypes = ClientNature.defaultGrantTypes( def );
            item.authMethod = ClientNature.defaultAuthMethod( def );
        }
    });

    // tracks the selection for updating data and UI (doesn't depend of the current pane as soon as natureId changes)
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.dataParts;
        const haveEndpoints = Boolean( dataDict.get( 'haveEndpoints' ));
        self.$( '.c-client-new-assistant-nature' ).closest( '.ca-assistant-template' ).trigger( 'do-enable-tab', { name: 'endpoints', enabled: haveEndpoints });
    });
});

Template.client_new_assistant_nature.helpers({
    // internationalization
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // description
    itDescription( it ){
        return ClientNature.description( it );
    },

    // identifier
    itId( it ){
        return ClientNature.id( it );
    },

    // image
    itImage( it ){
        return ClientNature.image( it );
    },

    // label
    itLabel( it ){
        return ClientNature.label( it );
    },

    // items list
    itemsList(){
        return ClientNature.Knowns();
    }
});

Template.client_new_assistant_nature.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-client-new-assistant-nature'( event, instance, data ){
        console.debug( event.type, data );
        this.parentAPP.dataParts.set( 'prev', false );
        this.parentAPP.dataParts.set( 'next', false );
    },
    'assistant-pane-shown .c-client-new-assistant-nature'( event, instance, data ){
        console.debug( event.type, data );
        this.parentAPP.dataParts.set( 'prev', true );
    },

    // nature selection
    'click .by-item'( event, instance ){
        const id = instance.$( event.currentTarget ).closest( '.by-item' ).data( 'item-id' );
        this.parentAPP.dataParts.set( 'natureId', id );
    }
});
