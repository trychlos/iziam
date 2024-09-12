/*
 * /imports/client/components/client_token_extensions_panel/client_token_extensions_panel.js
 *
 * A panel which let the client defines:
 * - either the chosen access token: the grant_type
 * - or some optional token extensions
 * 
 * This pane is written to be usable:
 * - either inside of the client-new-assistant
 * - or inside the client-edit.
 * 
 * Parms:
 * - organization: an { entity, record } object
 * - entity: the currently edited client entity as a ReactiveVar
 * - index: the index of the edited record
 * - checker: the Forms.Checker which manages the parent component as a ReactiveVar
 * - selectables: the list of selectables tokens
 *   this is up to the caller to present to this chooser either a list of grant types, or a list of token formaters
 * 
 * Forms.Checker doesn't manage well radio buttons: do not use here.
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import { Organizations } from '/imports/common/collections/organizations/index.js';

import { TokenExtension } from '/imports/common/definitions/token-extension.def.js';

import { Providers } from '/imports/common/tables/providers/index.js';

import './client_token_extensions_panel.html';

Template.client_token_extensions_panel.onCreated( function(){
    const self = this;

    self.APP = {
        organizationProviders: new ReactiveVar( {} ),
        // the available token extensions array of definitions
        selectables: new ReactiveVar( [] ),

        // whether this item is selected
        isSelected( dataContext, it ){
            const selected = ( dataContext.entity.get().DYN.records[dataContext.index].get().token_extensions || [] ).includes( it );
            return selected;
        }
    };

    // get the available organization providers
    self.autorun(() => {
        self.APP.organizationProviders.set( Organizations.fn.selectedProviders( Template.currentData().organization ));
    });

    // get the selectable grant types
    self.autorun(() => {
        self.APP.selectables.set( TokenExtension.Selectables( Object.keys( self.APP.organizationProviders.get())));
    });
});

Template.client_token_extensions_panel.helpers({
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
        return it ? TokenExtension.description( it ) : null;
    },

    itDisabled( it ){
    },

    // label
    itLabel( it ){
        return it ? TokenExtension.label( it ) : null;
    },

    // selectable list for one grant nature
    itemsList(){
        return Template.instance().APP.selectables.get();
    }
});

Template.client_token_extensions_panel.events({
    // token extensions selection
    // reactively reset the full list of selected token extensions in the record to let the UI auto-update
    'click .by-item'( event, instance ){
        let selected = [];
        instance.$( '.chooser input:checked' ).each( function( index, item ){
            selected.push( $( this ).closest( '.by-item' ).data( 'item-id' ));
        });
        let record = this.entity.get().DYN.records[this.index].get();
        record.token_extensions = selected;
        this.entity.get().DYN.records[this.index].set( record );
        // advertize the eventual caller (e.g. the client_new_assistant) of the new auth method
        instance.$( '.c-client-token-extensions-panel' ).trigger( 'iz-token-extensions', { token_extensions: selected });
    }
});
