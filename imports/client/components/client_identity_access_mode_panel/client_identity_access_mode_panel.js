/*
 * /imports/client/components/client_identity_access_mode_panel/client_identity_access_mode_panel.js
 *
 * Client identity access mode selection panel.
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
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import { IdentityAccessMode } from '/imports/common/definitions/identity-access-mode.def.js';

import './client_identity_access_mode_panel.html';

Template.client_identity_access_mode_panel.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        // the list of allowed auth methods definitions
        selectables: new ReactiveVar( [] ),

        // returns true if the definition is the current selection
        isSelected( dataContext, def ){
            const id = IdentityAccessMode.id( def );
            const record = dataContext.entity.get().DYN.records[dataContext.index].get();
            return record.identity_access_mode === id;
        }
    };

    // build the selectables auth methods list
    // they depend of the client type, may be superseded by the client profile
    self.autorun(() => {
        self.APP.selectables.set( IdentityAccessMode.Knowns());
    });

    // make sure we have a default value
    self.autorun(() => {
        const recordRv = Template.currentData().entity.get().DYN.records[Template.currentData().index];
        let record = recordRv.get();
        if( !record.identity_access_mode ){
            record.identity_access_mode = 'auth';
            recordRv.set( record);
        }
    });
});

Template.client_identity_access_mode_panel.helpers({
    // the preamble text
    content_text(){
        return pwixI18n.label( I18N, 'clients.edit.identities_access_preamble' );
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
        return IdentityAccessMode.description( it );
    },

    // identifier
    itId( it ){
        return IdentityAccessMode.id( it );
    },

    // label
    itLabel( it ){
        return IdentityAccessMode.label( it );
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

Template.client_identity_access_mode_panel.events({
    // ask for clear the panel
    'iz-clear-panel .c-client-auth-method-panel'( event, instance ){
    },
    // auth method selection
    // reactively set the record to trigger UI updates
    'click .by-item'( event, instance ){
        const id = instance.$( event.currentTarget ).data( 'item-id' );
        let record = this.entity.get().DYN.records[this.index].get();
        record.identity_access_mode = id;
        this.entity.get().DYN.records[this.index].set( record );
        // advertise the eventual caller (e.g. the client_new_assistant) of the new auth method
        instance.$( '.c-client-identity-access-mode-panel' ).trigger( 'iz-access-mode', { access_mode: id });
    }
});
