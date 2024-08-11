/*
 * /imports/client/components/client_new_assistant_grant_type/client_new_assistant_grant_type.js
 *
 * Parms:
* - parentAPP: the assistant APP whole object
*/

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

import { GrantType } from '/imports/common/definitions/grant-type.def.js';

import './client_new_assistant_grant_type.html';

Template.client_new_assistant_grant_type.onRendered( function(){
    const self = this;

    // tracks the selection to enable/disable the Next button when the pane is active
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.dataParts;
        if( dataDict.get( 'activePane' ) === 'grant' ){
            const array = dataDict.get( 'grantTypes' );
            dataDict.set( 'next', Boolean( array && _.isArray( array ) && array.length && GrantType.isValidSelection( array )));
        }
    });

    // tracks the selection for updating data and UI (doesn't depend of the current pane as soon as natureId changes)
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.dataParts;
        const array = dataDict.get( 'grantTypes' );
        if( array ){
            // if the grant types doesn't include client credentials, then disable the corresponding pane
            self.$( '.c-client-new-assistant-grant-type' ).closest( '.ca-assistant-template' ).trigger( 'do-enable-tab', { name: 'auth', enabled: array.includes( 'client_creds' )});
        }
    });
});

Template.client_new_assistant_grant_type.helpers({
    // internationalization
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // whether this item is selected ?
    itChecked( it ){
        const id = GrantType.id( it );
        return ( this.parentAPP.dataParts.get( 'grantTypes' ) || [] ).includes( id ) ? 'checked' : '';
    },

    // description
    itDescription( it ){
        return GrantType.description( it );
    },

    // whether this item is disabled ?
    itDisabled( it ){
        return GrantType.enabled( it ) ? '' : 'disabled';
    },

    // identifier
    itId( it ){
        return GrantType.id( it );
    },

    // image
    itImage( it ){
        return GrantType.image( it );
    },

    // label
    itLabel( it ){
        return GrantType.label( it );
    },

    // whether this item is selected ?
    itSelected( it ){
        const id = GrantType.id( it );
        return ( this.parentAPP.dataParts.get( 'grantTypes' ) || [] ).includes( id ) ? 'selected' : '';
    },

    // items list
    itemsList(){
        return GrantType.Selectables();
    },

    // parms for current choices
    parmsCurrent(){
        return {
            parentAPP: this.parentAPP,
            display: this.parentAPP.previousPanes()
        };
    }
});

Template.client_new_assistant_grant_type.events({
    // enable/disable the action buttons
    'assistant-pane-to-show .c-client-new-assistant-grant-type'( event, instance, data ){
        console.debug( event.type, data );
        this.parentAPP.dataParts.set( 'prev', false );
        this.parentAPP.dataParts.set( 'next', false );
    },
    'assistant-pane-shown .c-client-new-assistant-grant-type'( event, instance, data ){
        console.debug( event.type, data );
        this.parentAPP.dataParts.set( 'prev', true );
    },

    // handle the pane input
    'input .js-check'( event, instance ){
        const $box = instance.$( event.currentTarget );
        const checked = $box.prop( 'checked' );
        const id = $box.closest( '.by-item' ).data( 'item-id' );
        const array = this.parentAPP.dataParts.get( 'grantTypes' );
        if( checked ){
            array.push( id );
        } else {
            let idx = -1;
            for( let i=0 ; i<array.length ; ++i ){
                if( array[i] === id ){
                    idx = i;
                    break;
                }
            }
            if( idx >= 0 ){
                array.splice( idx, 1 );
            }
        }
        this.parentAPP.dataParts.set( 'grantTypes', array );
        // if grant types includes client credentials, then make sure we have an auth method
        if( array.includes( 'client_creds' )){
            const auth = this.parentAPP.dataParts.get( 'authMethod' );
            if( auth === 'none' ){
                const def = GrantType.byId( 'client_creds' );
                this.parentAPP.dataParts.set( 'authMethod', GrantType.defaultAuthMethod( def ));
            }
        }
    }
});
