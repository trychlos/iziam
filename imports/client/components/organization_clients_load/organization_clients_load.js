/*
 * /imports/client/components/organization_clients_load/organization_clients_load.js
 *
 * An non-visible component which loads the clients of the organization into the ClientsRegistrar installed in organization.DYN.clients
 * - list: a ReactiveVar which contains the array of the clients
 * - byId( id<String> ): <Client>: a search function available at '<organization>.DYN.clients.byId()'
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization as an entity with its DYN.records array
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - entityTabs
 * - recordTabs
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { TenantsManager } from 'meteor/pwix:tenants-manager';

import './organization_clients_load.html';

Template.organization_clients_load.onCreated( function(){
    const self = this;

    self.autorun(() => {
        const edited = Template.currentData().item.get();
        const organization = TenantsManager.list.byEntity( edited._id );
        if( organization && organization.DYN.clients ){
            organization.DYN.clients.clientLoad();
        }
    });
});
