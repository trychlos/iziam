/*
 * pwix:tabular/src/client/components/provider_selection_checkbox/provider_selection_checkbox.js
 *
 * Data context is provided at the constructor level:
 * - item: the provider object (not an instance)
 * - field: the Field.Def definition
 * - selectedRv: a ReactiveVar which contains the currently selected providers as an object
 * - caller: the current client or organization as an object { entity, record }
 * - selectedProviders: the function which returns the selected providers for the caller
 * - withConstraints: whether we want meet each provider constraints (not at the organization level)
 */

import { Providers } from '/imports/common/collections/providers/index.js';

import './provider_selection_checkbox.html';

Template.provider_selection_checkbox.onCreated( function(){
    //console.debug( this );
});

Template.provider_selection_checkbox.helpers({
    // whether the checkbox is checked ?
    checked(){
        const selected = this.selectedRv.get();
        const checked = Object.keys( selected ).includes( this.item.id );
        return checked ? 'checked' : '';
    },

    // whether the checkbox is disabled ?
    // when selecting providers at the organization level, all displayed providers are selectable
    //  at the client level, we must respect the constraints of each provider
    enabled(){
        let enabled = false;
        const provider = Providers.byId( this.item.id );
        if( provider ){
            enabled = this.withConstraints ? provider.isSelectable( Object.keys( this.selectedRv.get())) : provider.userSelectable();
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
        const providerId = this.item.id;
        if( checked ){
            this.caller.record.selectedProviders = this.caller.record.selectedProviders || [];
            this.caller.record.selectedProviders.push( providerId );
        } else {
            this.caller.record.selectedProviders = this.caller.record.selectedProviders.filter( it => it !== providerId );
        }
        this.selectedRv.set( this.selectedProviders( this.caller ));
    }
});
