/*
 * /imports/client/components/organization_identities_load/organization_identities_load.js
 *
 * An non-visible component which loads the identities attached to the organization into the IdentitiesRegistrar installed in organization.DYN.identities
 * - list: a ReactiveVar which contains the array of the identities
 * - byId( id<String> ): <Identity>: a search function available at '<organization>.DYN.identities.byId()'
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization as an entity with its DYN.records array
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - entityTabs
 * - recordTabs
 */

import { TenantsManager } from 'meteor/pwix:tenants-manager';

import { IdentitiesRegistrar } from '/imports/common/classes/identities-registrar.class.js';

import './organization_identities_load.html';

Template.organization_identities_load.onCreated( function(){
    //console.debug( this );
    this.autorun(() => {
        const edited = Template.currentData().item.get();
        const organization = TenantsManager.list.byEntity( edited._id );
        if( organization && organization.DYN.identities ){
        organization.DYN.identities.identitiesLoad();
        }
    });
});
