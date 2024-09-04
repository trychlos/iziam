/*
 * /imports/client/components/client_auth_method_panel/client_auth_method_panel.js
 *
 * Client authentication methods selection panel.
 * 
 * This pane is written to be usable:
 * - either inside of the client-new-assistant
 * - or inside the client-edit.
 * 
 * Parms:
 * - entity: the currently edited client entity as a ReactiveVar
 * - index: the index of the edited record
 * - checker: the Forms.Checker which manages the parent component as a ReactiveVar
 * - selectables: the list of selectables auth methods
 * 
 * Forms.Checker doesn't manage well radio buttons: do not use here.
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import { AuthMethod } from '/imports/common/definitions/auth-method.def.js';
import { ClientType } from '/imports/common/definitions/client-type.def.js';

import './client_auth_method_panel.html';

Template.client_auth_method_panel.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        // the list of allowed auth methods definitions
        selectables: new ReactiveVar( [] ),

        // returns true if the definition is the current selection
        isSelected( def ){
            const id = AuthMethod.id( def );
            const entity = Template.currentData().entity.get();
            const index = Template.currentData().index;
            const record = entity.DYN.records[index].get();
            return record.token_endpoint_auth_method === id;
        }
    };

    // build the list of auth methods definitions from the provided list of allowed identifiers
    self.autorun(() => {
        let selectables = [];
        Template.currentData().selectables.forEach(( it ) => {
            const def = AuthMethod.byId( it );
            if( def ){
                selectables.push( def );
            } else {
                console.warn( 'auth method not found', it );
            }
        });
        self.APP.selectables.set( selectables );
    });

    // available auth method depends of the client type
    // make sure the new client type is compatible with the current auth method
    self.autorun(() => {
        const recordRv = Template.currentData().entity.get().DYN.records[Template.currentData().index];
        let record = recordRv.get();
        const clientType = record.client_type;
        if( clientType ){
            typeDef = ClientType.byId( clientType );
            if( typeDef ){
                const authMethod = record.token_endpoint_auth_method;
                if( authMethod && !ClientType.defaultAuthMethods( typeDef ).includes( authMethod )){
                    delete record.token_endpoint_auth_method;
                    recordRv.set( record );
                }
            }
        }
    });
});

Template.client_auth_method_panel.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // whether this item is selected ?
    itChecked( it ){
        return Template.instance().APP.isSelected( it ) ? 'checked' : '';
    },

    // description
    itDescription( it ){
        return AuthMethod.description( it );
    },

    // identifier
    itId( it ){
        return AuthMethod.id( it );
    },

    // label
    itLabel( it ){
        return AuthMethod.label( it );
    },

    // whether this item is selected ?
    itSelected( it ){
        return Template.instance().APP.isSelected( it ) ? 'selected' : '';
    },

    // items list: a list of allowed auth methods definitions
    itemsList(){
        return Template.instance().APP.selectables.get();
    }
});

Template.client_auth_method_panel.events({
    // ask for clear the panel
    'iz-clear-panel .c-client-auth-method-panel'( event, instance ){
    },
    // auth method selection
    'click .by-item'( event, instance ){
        const id = instance.$( event.currentTarget ).data( 'item-id' );
        this.entity.get().DYN.records[this.index].get().token_endpoint_auth_method = id;
        // advertize the eventual caller (e.g. the client_new_assistant) of the new auth method
        instance.$( '.c-client-auth-method-panel' ).trigger( 'iz-auth-method', { auth_method: id });
    }
});
