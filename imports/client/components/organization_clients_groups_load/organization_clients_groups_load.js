/*
 * /imports/client/components/organization_clients_groups_load/organization_clients_groups_load.js
 *
 * An non-visible component which loads the clients groups of the organization into the ClientsGroupsRegistrar installed in organization.DYN.clients_groups
 * - list: a ReactiveVar which contains the array of the groups
 * - byId( id<String> ): <Group>: a search function available at '<organization>.DYN.groups.byId()'
 * 
 * This component is instanciated when editing a tenant.
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization as an entity with its DYN.records array
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - entityTabs
 * - recordTabs
 */

import { TenantsManager } from 'meteor/pwix:tenants-manager';

import './organization_clients_groups_load.html';

Template.organization_clients_groups_load.onCreated( function(){
    //console.debug( this );
    this.autorun(() => {
        const edited = Template.currentData().item.get();
        const organization = TenantsManager.list.byEntity( edited._id );
        if( organization && organization.DYN.clients_groups ){
            organization.DYN.clients_groups.groupsLoad();
        }
    });
});
