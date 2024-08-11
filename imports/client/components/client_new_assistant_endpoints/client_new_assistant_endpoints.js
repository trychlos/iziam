/*
 * /imports/client/components/client_new_assistant_endpoints/client_new_assistant_endpoints.js
 *
 * Parms:
 * - parentAPP: the assistant APP whole object
 */

import _ from 'lodash';
import validUrl from 'valid-url';

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import { ClientNature } from '/imports/common/definitions/client-nature.def.js';

import '/imports/client/jquery/jqw-table/jqw-table.js';

import './client_new_assistant_endpoints.html';

Template.client_new_assistant_endpoints.onCreated( function(){
    const self = this;

    self.APP = {
        label: new ReactiveVar( null ),
        addEnabled: new ReactiveVar( false ),
        clearEnabled: new ReactiveVar( false ),

        clear(){
            self.$( '.js-label' ).val( '' );
            self.APP.label.set( null );
        }
    };
});

Template.client_new_assistant_endpoints.onRendered( function(){
    const self = this;

    self.$( 'table.input-table' ).jqwTable();
    self.$( 'table.js-table' ).jqwTable();

    // relabel jqwTable headers when language changes
    //  argument is not used, but triggers the autorun when language changes
    self.autorun(() => {
        self.$( 'table.js-table' ).jqwTable( 'relabel', pwixI18n.language());
    });

    // tracks the selection to enable/disable the Next button when the pane is active
    //  must have at least one redirect URL unless we are a machine-to-machine client where we must not have any
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.dataParts;
        if( dataDict.get( 'activePane' ) === 'endpoints' ){
            const natureDef = dataDict.get( 'natureDefinition' );
            const endpoints = dataDict.get( 'endpoints' ) || [];
            const valid = natureDef ? ( ClientNature.defaultHaveEndpoints( natureDef ) ? endpoints.length > 0 : endpoints.length === 0 ) : false;
            dataDict.set( 'next', valid );
        }
    });

    // tracks the selection for updating data and UI
    self.autorun(() => {
    });

    // track the input field to enable/disable Add button
    //  the new url must be set and not already registered
    self.autorun(() => {
        const label = self.APP.label.get();
        const endpoints = Template.currentData().parentAPP.dataParts.get( 'endpoints' ) || [];
        self.APP.addEnabled.set( Boolean( label && label.length && validUrl.isUri( label ) && !endpoints.includes( label )));
        self.APP.clearEnabled.set( Boolean( label && label.length ));
    });
});

Template.client_new_assistant_endpoints.helpers({
    // whether to enable Add button ?
    addDisabled(){
        return Template.instance().APP.addEnabled.get() ? '' : 'disabled';
    },

    // whether to enable Clear button ?
    clearDisabled(){
        return Template.instance().APP.clearEnabled.get() ? '' : 'disabled';
    },

    // whether we have endpoints ?
    haveItems(){
        return ( this.parentAPP.dataParts.get( 'endpoints' ) || [] ).length > 0;
    },

    // internationalization
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // endpoint identifier: sane than the url itself
    itId( it ){
        return it;
    },

    // an endpoint (aka redirect url)
    itEndpoint( it ){
        return it;
    },

    // items list
    itemsList(){
        return ( this.parentAPP.dataParts.get( 'endpoints' ) || [] );
    },

    // parms for current choices
    parmsCurrent(){
        return {
            parentAPP: this.parentAPP,
            display: this.parentAPP.previousPanes()
        };
    }
});

Template.client_new_assistant_endpoints.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-client-new-assistant-endpoints'( event, instance, data ){
        console.debug( event.type, data );
        this.parentAPP.dataParts.set( 'prev', false );
        this.parentAPP.dataParts.set( 'next', false );
    },
    'assistant-pane-shown .c-client-new-assistant-endpoints'( event, instance, data ){
        console.debug( event.type, data );
        this.parentAPP.dataParts.set( 'prev', true );
    },
    // get the fields values (at least the name must be set asap to be able to enable the Next button)
    'click .js-clear'( event, instance, data ){
        instance.APP.clear();
    },
    'click .js-add'( event, instance, data ){
        const url = instance.APP.label.get();
        const array = this.parentAPP.dataParts.get( 'endpoints' ) || [];
        array.push( url );
        this.parentAPP.dataParts.set( 'endpoints', array );
        instance.APP.clear();
    },
    'click .js-minus'( event, instance, data ){
        const url = instance.$( event.currentTarget ).closest( 'tr' ).data( 'item-id' );
        const array = this.parentAPP.dataParts.get( 'endpoints' ) || [];
        let idx = -1;
        for( let i=0 ; i<array.length ; ++i ){
            if( array[i] === url ){
                idx = i;
                break;
            }
        }
        if( idx >= 0 ){
            array.splice( idx, 1 );
            this.parentAPP.dataParts.set( 'endpoints', array );
        }
    },
    'input .js-label'( event, instance, data ){
        instance.APP.label.set( instance.$( '.js-label' ).val());
    }
});
