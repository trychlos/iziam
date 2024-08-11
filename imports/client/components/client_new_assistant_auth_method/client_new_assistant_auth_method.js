/*
 * /imports/client/components/client_new_assistant_auth_method/client_new_assistant_auth_method.js
 *
 * Parms:
 * - parentAPP: the assistant APP whole object
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

import { AuthMethod } from '/imports/common/definitions/auth-method.def.js';

import './client_new_assistant_auth_method.html';

Template.client_new_assistant_auth_method.onRendered( function(){
    const self = this;

    // tracks the selection to enable/disable the Next button when the pane is active
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.dataParts;
        if( dataDict.get( 'activePane' ) === 'auth' ){
            const auth = dataDict.get( 'authMethod' );
            const grants = dataDict.get( 'grantTypes' );
            // auth cannot be none if grant have client_creds
            dataDict.set( 'next', Boolean( auth?.length && ( auth !== 'none' || !grants.includes( 'client_creds' ))));
        }
    });

    // tracks the selection for updating data and UI (doesn't depend of the current pane as soon as natureId changes)
    self.autorun(() => {
    });
});

Template.client_new_assistant_auth_method.helpers({
    // internationalization
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // whether this item is selected ?
    itChecked( it ){
        const id = AuthMethod.id( it );
        return ( this.parentAPP.dataParts.get( 'authMethod' ) || [] ).includes( id ) ? 'checked' : '';
    },

    // description
    itDescription( it ){
        return AuthMethod.description( it );
    },

    // whether this item is disabled ?
    //  we disable the 'none' option if grant types includes client_creds
    itDisabled( it ){
        let enabled = true;
        if( AuthMethod.id( it ) === 'none' ){
            enabled = !( this.parentAPP.dataParts.get( 'grantTypes' ) || [] ).includes( 'client_creds' );
        }
        return enabled ? '' : 'disabled';
    },

    // identifier
    itId( it ){
        return AuthMethod.id( it );
    },

    // image
    itImage( it ){
        return AuthMethod.image( it );
    },

    // label
    itLabel( it ){
        return AuthMethod.label( it );
    },

    // whether this item is selected ?
    itSelected( it ){
        const id = AuthMethod.id( it );
        return this.parentAPP.dataParts.get( 'authMethod' ) === id ? 'selected' : '';
    },

    // items list
    itemsList(){
        return AuthMethod.Knowns();
    },

    // parms for current choices
    parmsCurrent(){
        return {
            parentAPP: this.parentAPP,
            display: this.parentAPP.previousPanes()
        };
    }
});

Template.client_new_assistant_auth_method.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-client-new-assistant-auth-method'( event, instance, data ){
        console.debug( event.type, data );
        this.parentAPP.dataParts.set( 'prev', false );
        this.parentAPP.dataParts.set( 'next', false );
    },
    'assistant-pane-shown .c-client-new-assistant-auth-method'( event, instance, data ){
        console.debug( event.type, data );
        this.parentAPP.dataParts.set( 'prev', true );
    },

    // auth method selection
    'click .by-item'( event, instance ){
        const id = instance.$( event.currentTarget ).closest( '.by-item' ).data( 'item-id' );
        this.parentAPP.dataParts.set( 'authMethod', id );
    }
});
