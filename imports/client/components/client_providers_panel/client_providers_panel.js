/*
 * /imports/client/components/client_providers_panel/client_providers_panel.js
 *
 * Display all the selected providers and their features.
 * Let the user select/unselect the items.
 *
 * Parms:
 * - checker: a ReactiveVar which contains the current Forms.Checker
 * - entity: a ReactiveVar which contains the Client entity
 * - index: the index of the current record
 * - organization: a { entity, record } object
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import { Clients } from '/imports/common/collections/clients/index.js';
import { Organizations } from '/imports/common/collections/organizations/index.js';

import '/imports/client/components/providers_list/providers_list.js';

import './client_providers_panel.html';

Template.client_providers_panel.onCreated( function(){
    const self = this;
//  console.debug( this );

    self.APP = {
        // an object { entity, record }
        client: new ReactiveVar( null )
    };

    // get the data context and instanciate the client object
    self.autorun(() => {
        const dataContext = Template.currentData();
        const entity = dataContext.entity.get();
        self.APP.client.set({
            entity: entity,
            record: entity.DYN.records[dataContext.index].get()
        });
    });
});

Template.client_providers_panel.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for the providers_list
    // see the providers_list component for a description of the expected data context
    parmsProvidersList(){
        let parms = {
            baseProvidersFn: Organizations.fn.selectedProviderInstances,
            selectedProvidersGetFn: Clients.fn.selectedProvidersGet,
            selectedProvidersAddFn: Clients.fn.selectedProvidersAdd,
            selectedProvidersRemoveFn: Clients.fn.selectedProvidersRemove,
            args: {
                caller: Template.instance().APP.client.get(),
                parent: this.organization,
            }
        };
        return parms;
    }
});
