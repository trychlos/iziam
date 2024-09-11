/*
 * /imports/client/components/provider_selection_checkbox/provider_selection_checkbox.js
 *
 * Data context is provided at the tabular level:
 * - item: the provider object (not an instance)
 * - field: the Field.Def definition
 * +
 * - the providers_list data context (including 'withConstraints' set in providers_list)
 */

import { Providers } from '/imports/common/tables/providers/index.js';

import './provider_selection_checkbox.html';

Template.provider_selection_checkbox.onCreated( function(){
    //console.debug( this );
});

Template.provider_selection_checkbox.helpers({
    // whether the checkbox is checked ?
    checked(){
        const selected = this.selectedProvidersGetFn( this.args );
        const checked = Object.keys( selected ).includes( this.item.id );
        return checked ? 'checked' : '';
    },

    // whether the checkbox is disabled ?
    // when selecting providers at the organization level, all displayed providers are selectable
    //  at the client level, we must respect the constraints of each provider which means that
    //  selecting a provider automatically select (and disable) all its constraints
    enabled(){
        //console.debug( this );
        let enabled = false;
        const provider = Providers.byId( this.item.id );
        if( provider ){
            enabled = true;
            if( this.withConstraints ){
                enabled = provider.isSelectable( Object.keys( this.selectedProvidersGetFn( this.args )));
                if( enabled ){
                    if( provider.isMandatory( this.args.parent )){
                            enabled = false;
                    }
                }
            } else {
                enabled = provider.userSelectable();
            }
        } else {
            console.warn( 'unable to get a provider for id='+this.item.id );
        }
        return enabled ? '' : 'disabled';
    }
});
