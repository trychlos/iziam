/*
 * pwix:tabular/src/client/components/provider_selection_checkbox/provider_selection_checkbox.js
 *
 * Data context is provided at the constructor level:
 * - item: the provider bject
 * - client: the current client as an object { entity, record }
 * - field: the Field.Def definition
 * - selectedRv: a ReactiveVar which contains the currently selected providers as an object
 */

import { Clients } from '/imports/common/collections/clients/index.js';
import { Providers } from '/imports/common/collections/providers/index.js';

import './provider_selection_checkbox.html';

Template.provider_selection_checkbox.helpers({
    // whether the checkbox is checked ?
    checked(){
        const selected = this.selectedRv.get();
        const checked = Object.keys( selected ).includes( this.item.id );
        return checked ? 'checked' : '';
    },

    // whether the checkbox is disabled ?
    enabled(){
        let enabled = false;
        const provider = Providers.byId( this.item.id );
        if( provider ){
            enabled = provider.isSelectable( Object.keys( this.selectedRv.get()));
        } else {
            console.warn( 'unable to get a provider for id='+this.item.id );
        }
        //console.debug( this.item.id, 'enabled', enabled );
        return enabled ? '' : 'disabled';
    }
});

Template.provider_selection_checkbox.events({
    'click .c-provider-selection-checkbox input'( event, instance ){
        const checked = instance.$( event.currentTarget ).prop( 'checked' );
        let client = this.client;
        const providerId = this.item.id;
        if( checked ){
            client.record.selectedProviders = client.record.selectedProviders || [];
            client.record.selectedProviders.push( providerId );
        } else {
            client.record.selectedProviders = client.record.selectedProviders.filter( it => it !== providerId );
        }
        this.selectedRv.set( Clients.fn.selectedProviders( client ))
    }
});
