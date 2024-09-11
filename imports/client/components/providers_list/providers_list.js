/*
 * /imports/client/components/providers_list/providers_list.js
 *
 * Let the user select/unselect providers among a predefined list.
 * This component is used both for an organization and for a client.
 *
 * Parms:
 * - baseProvidersFn: a function which returns the base list of providers,
 *   either the all registered providers if caller is an organization, or the providers selected by the organization if the caller is a client
 * - selectedProvidersGetFn: a function which returns the current list of selected providers for the caller
 * - selectedProvidersAddFn: a function which adds a provider to the current selection
 * - selectedProvidersRemoveFn: a function which removes a provider from the current selection
 * - args: an object to pass as an argument to above functions, with following keys:
 *   > caller, an { entity, record } object
 *   > parent, an { entity, record } object which may be null
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import { Providers } from '/imports/common/tables/providers/index.js';

import './providers_list.html';

Template.providers_list.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        tabular: null
    };

    // get the data context and instanciate the tabular instance
    self.autorun(() => {
        if( !self.APP.tabular ){
            const dataContext = Template.currentData();
            dataContext.withConstraints = ( dataContext.args.parent != null );
            self.APP.tabular = Providers.tabular( dataContext );
        }
    });
});

Template.providers_list.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    }
});

Template.providers_list.events({
    // data context here is providers_list's data context + item (the provider data object) + field (field def)
    'click .c-provider-selection-checkbox input'( event, instance ){
        const checked = instance.$( event.currentTarget ).prop( 'checked' );
        if( checked ){
            this.selectedProvidersAddFn( this.args, this.item.id );
        } else {
            this.selectedProvidersRemoveFn( this.args, this.item.id );
        }
        // advertize of the change
        instance.$( '.c-providers-list' ).trigger( 'iz-providers', { providers: this.selectedProvidersGetFn( this.args ) });
    }
});
