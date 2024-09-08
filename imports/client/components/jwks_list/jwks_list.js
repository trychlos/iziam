/*
 * /imports/client/components/jwks_list/jwks_list.js
 *
 * Let the user manages its list of JWK.
 * This component is used both for an organization and for a client.
 *
 * Parms:
 * - listGetFn: a function which returns the current list of selected providers for the caller
 * - listAddFn: a function which adds a provider to the current selection
 * - listRemoveFn: a function which removes a provider from the current selection
 * - args: an object to pass as an argument to above functions, with following keys:
 *   > caller, an { entity, record } object
 *   > parent, an { entity, record } object which may be null
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import { Jwks } from '/imports/common/tables/jwks/index.js';

import './jwks_list.html';

Template.jwks_list.onCreated( function(){
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
            self.APP.tabular = Jwks.tabular( dataContext );
        }
    });
});

Template.jwks_list.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    }
});
