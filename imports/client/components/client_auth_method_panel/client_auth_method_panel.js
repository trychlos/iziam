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
 * - index: the index of the currently edited Client record
 * - checker: the Forms.Checker which manages the parent component as a ReactiveVar
 * - organization: the Organization as an entity with its DYN.records array
 * - isAssistant: whether we are running inside of the new client assistant, defaulting to false
 * 
 * Forms.Checker doesn't manage well radio buttons: do not use here.
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import { AuthMethod } from '/imports/common/definitions/auth-method.def.js';
import { ClientProfile } from '/imports/common/definitions/client-profile.def.js';
import { ClientType } from '/imports/common/definitions/client-type.def.js';

import './client_auth_method_panel.html';

Template.client_auth_method_panel.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        // the list of allowed auth methods definitions
        selectables: new ReactiveVar( [] ),

        // returns true if the definition is the current selection
        isSelected( dataContext, def ){
            const id = AuthMethod.id( def );
            const record = dataContext.entity.get().DYN.records[dataContext.index].get();
            return record.token_endpoint_auth_method === id;
        }
    };

    // build the selectables auth methods list
    // they depend of the client type, may be superseded by the client profile
    self.autorun(() => {
        const record = Template.currentData().entity.get().DYN.records[Template.currentData().index].get();
        const isAssistant = Template.currentData().isAssistant === true;
        const clientType = record.client_type || null;
        const profileId = record.profile || null;
        const profileDef = profileId ? ClientProfile.byId( profileId ) : null;
        let selectableIds = [];
        let selectableDefs = [];
        if( isAssistant && profileDef && clientType ){
            selectableIds = ClientProfile.defaultAuthMethods( profileDef );
            if( !selectableIds || !selectableIds.length ){
                typeDef = ClientType.byId( clientType );
                if( typeDef ){
                    selectableIds = ClientType.defaultAuthMethods( typeDef );
                }
            }
        } else if( !isAssistant ){
            AuthMethod.Knowns().forEach(( it ) => {
                selectableIds.push( AuthMethod.id( it ));
            });
        }
        selectableIds = selectableIds || [];
        selectableIds.forEach(( it ) => {
            const def = AuthMethod.byId( it );
            if( def ){
                selectableDefs.push( def );
            }
        });
        self.APP.selectables.set( selectableDefs );
    });

    // available auth method depends of the client type
    // make sure these two are compatible
    self.autorun(() => {
        const recordRv = Template.currentData().entity.get().DYN.records[Template.currentData().index];
        const isAssistant = Template.currentData().isAssistant === true;
        let record = recordRv.get();
        const clientType = record.client_type;
        if( clientType ){
            typeDef = ClientType.byId( clientType );
            if( typeDef ){
                const authMethod = record.token_endpoint_auth_method;
                const defaultMethods = ClientType.defaultAuthMethods( typeDef );
                if( !authMethod || ( isAssistant && !defaultMethods.includes( authMethod ))){
                    record.token_endpoint_auth_method = defaultMethods[0];
                    recordRv.set( record );
                }
            }
        }
    });
});

Template.client_auth_method_panel.helpers({
    // the context text depends of the current client_type
    // if the chosen profile is 'Generic' then display the two texts
    content_text(){
        const clientProfile = this.entity.get().DYN.records[this.index].get().profile;
        const clientType = this.entity.get().DYN.records[this.index].get().client_type;
        let text = '';
        if( clientProfile === 'generic' ){
            text = pwixI18n.label( I18N, 'clients.new_assistant.auth_method_confidential_text' )
                +'<br />'
                +pwixI18n.label( I18N, 'clients.new_assistant.auth_method_public_text' );

        } else if( clientType === 'confidential' ){
            text = pwixI18n.label( I18N, 'clients.new_assistant.auth_method_confidential_text' );

        } else if( clientType === 'public' ){
            text = pwixI18n.label( I18N, 'clients.new_assistant.auth_method_public_text' );
        }
        text += '<br />'
            +pwixI18n.label( I18N, 'clients.new_assistant.auth_method_choose_text' );
        return text;
    },

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // whether this item is selected ?
    itChecked( it ){
        return Template.instance().APP.isSelected( this, it ) ? 'checked' : '';
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
        return Template.instance().APP.isSelected( this, it ) ? 'selected' : '';
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
    // reactively set the record to trigger UI updates
    'click .by-item'( event, instance ){
        const id = instance.$( event.currentTarget ).data( 'item-id' );
        let record = this.entity.get().DYN.records[this.index].get();
        record.token_endpoint_auth_method = id;
        this.entity.get().DYN.records[this.index].set( record );
        // advertise the eventual caller (e.g. the client_new_assistant) of the new auth method
        instance.$( '.c-client-auth-method-panel' ).trigger( 'iz-auth-method', { auth_method: id });
    }
});
