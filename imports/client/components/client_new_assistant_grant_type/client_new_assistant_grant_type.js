/*
 * /imports/client/components/client_new_assistant_grant_type/client_new_assistant_grant_type.js
 *
 * Grant types are selectable by nature of grant type:
 * - one for the access token
 * - maybe one for the refresh token
 * - maybe several for the token formaters
 *
 * Parms:
* - parentAPP: the assistant APP whole object
*/

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import { GrantNature } from '/imports/common/definitions/grant-nature.def.js';
import { GrantType } from '/imports/common/definitions/grant-type.def.js';

import './client_new_assistant_grant_type.html';

Template.client_new_assistant_grant_type.onCreated( function(){
    const self = this;

    self.APP = {
        selectables: new ReactiveVar( {} )
    };

    // set the selectables list
    self.autorun(() => {
        const selectables = GrantType.Selectables( Template.currentData().parentAPP.assistantStatus.get( 'selectedProviders' ));
        self.APP.selectables.set( selectables );
        console.debug( 'selectables', selectables );
    });
});

Template.client_new_assistant_grant_type.onRendered( function(){
    const self = this;

    // tracks the selected providers to enable/disable this pane
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        const selected = dataDict.get( 'selectedProviders' );
        self.$( '.c-client-new-assistant-grant-type' ).trigger( 'assistant-do-enable-tab', { name: 'grant',  enabled: selected && selected.length > 0 });
    });

    // tracks the selection to enable/disable the Next button when the pane is active
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        if( dataDict.get( 'activePane' ) === 'grant' ){
            const array = dataDict.get( 'grantTypes' );
            dataDict.set( 'next', Boolean( array && _.isArray( array ) && array.length && GrantType.isValidSelection( array )));
        }
    });

    // tracks the selection for updating data and UI (doesn't depend of the current pane as soon as profileId changes)
    self.autorun(() => {
        const dataDict = Template.currentData().parentAPP.assistantStatus;
        const array = dataDict.get( 'grantTypes' );
        if( array ){
            // if the grant types doesn't include client credentials, then disable the corresponding pane
            self.$( '.c-client-new-assistant-grant-type' ).closest( '.Assistant' ).trigger( 'do-enable-tab', { name: 'auth', enabled: array.includes( 'client_creds' )});
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
        return ( this.parentAPP.assistantStatus.get( 'grantTypes' ) || [] ).includes( id ) ? 'checked' : '';
    },

    // description
    itDescription( nature, it ){
        const selectables = Template.instance().APP.selectables.get();
        return GrantType.description( selectables[nature].types[it] );
    },

    // whether this item is disabled ?
    itDisabled( it ){
        return GrantType.enabled( it ) ? '' : 'disabled';
    },

    // whether this input element is a checkbox or a radio button ?
    itInputType( nature, it ){
        const selectables = Template.instance().APP.selectables.get();
        return GrantNature.acceptSeveral( selectables[nature].def ) ? 'checkbox' : 'radio';
    },

    // label
    itLabel( nature, it ){
        const selectables = Template.instance().APP.selectables.get();
        return GrantType.label( selectables[nature].types[it] );
    },

    // whether this item is selected ?
    itSelected( it ){
        const id = GrantType.id( it );
        return ( this.parentAPP.assistantStatus.get( 'grantTypes' ) || [] ).includes( id ) ? 'selected' : '';
    },

    // selectable list for one grant nature
    itemsList( nature ){
        const selectables = Template.instance().APP.selectables.get();
        return nature ? Object.keys( selectables[nature].types ) : [];
    },

    // a label for the grant nature
    natureHeader( nature ){
        const selectables = Template.instance().APP.selectables.get();
        const natureDef = nature ? selectables[nature].def : null;
        return natureDef ? GrantNature.label( natureDef ) : '';
    },

    // list of available natures
    naturesList(){
        console.debug( Object.keys( Template.instance().APP.selectables.get()));
        return Object.keys( Template.instance().APP.selectables.get());
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
        this.parentAPP.assistantStatus.set( 'prev', false );
        this.parentAPP.assistantStatus.set( 'next', false );
    },
    'assistant-pane-shown .c-client-new-assistant-grant-type'( event, instance, data ){
        console.debug( event.type, data );
        this.parentAPP.assistantStatus.set( 'prev', true );
    },

    // handle the pane input
    'input .js-check'( event, instance ){
        const $box = instance.$( event.currentTarget );
        const checked = $box.prop( 'checked' );
        const id = $box.closest( '.by-item' ).data( 'item-id' );
        const array = this.parentAPP.assistantStatus.get( 'grantTypes' );
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
        this.parentAPP.assistantStatus.set( 'grantTypes', array );
        // if grant types includes client credentials, then make sure we have an auth method
        if( array.includes( 'client_creds' )){
            const auth = this.parentAPP.assistantStatus.get( 'authMethod' );
            if( auth === 'none' ){
                const def = GrantType.byId( 'client_creds' );
                this.parentAPP.assistantStatus.set( 'authMethod', GrantType.defaultAuthMethod( def ));
            }
        }
    }
});
