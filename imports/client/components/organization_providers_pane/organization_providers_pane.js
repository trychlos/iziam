/*
 * /imports/clients/components/organization_providers_pane/organization_providers_pane.js
 *
 * Display all the selected providers and their features.
 * Let the user select/unselect the items.
 *
 * Parms:
 * - checker: a ReactiveVar which contains the current Forms.Checker
 * - entity: a ReactiveVar which contains the Organization entity
 * - index: the index of the current record
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import { Organizations } from '/imports/common/collections/organizations/index.js';
import { Providers } from '/imports/common/tables/providers/index.js';

import '/imports/client/components/providers_list/providers_list.js';

import './organization_providers_pane.html';

Template.organization_providers_pane.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        // an object { entity, record }
        organization: new ReactiveVar( null )
    };

    // get the data context and instanciate the organization tabular instance
    self.autorun(() => {
        const dataContext = Template.currentData();
        const entity = dataContext.entity.get();
        self.APP.organization.set({
            entity: entity,
            record: entity.DYN.records[dataContext.index].get()
        });
    });
});

Template.organization_providers_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for the providers_list
    // see the providers_list component for a description of the expected data context
    parmsProvidersList(){
        let parms = {
            baseProvidersFn: Providers.allProviders,
            selectedProvidersGetFn: Organizations.fn.selectedProvidersGet,
            selectedProvidersAddFn: Organizations.fn.selectedProvidersAdd,
            selectedProvidersRemoveFn: Organizations.fn.selectedProvidersRemove,
            args: {
                caller: Template.instance().APP.organization.get(),
                parent: null,
            }
        };
        return parms;
    }
});
