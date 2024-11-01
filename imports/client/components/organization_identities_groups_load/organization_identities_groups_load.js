/*
 * /imports/client/components/organization_identities_groups_load/organization_identities_groups_load.js
 *
 * An non-visible component which loads the groups of the organization into the GroupsRegistrar installed in organization.DYN.groups
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

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { TenantsManager } from 'meteor/pwix:tenants-manager';

import './organization_identities_groups_load.html';

Template.organization_identities_groups_load.onCreated( function(){
    //console.debug( this );
    this.autorun(() => {
        const edited = Template.currentData().item.get();
        const organization = TenantsManager.list.byEntity( edited._id );
        if( organization && organization.DYN.identities_groups ){
            organization.DYN.identities_groups.clientLoad();
        }
    });
});
