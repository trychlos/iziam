/*
 * /imports/client/components/organization_authorizations_load/organization_authorizations_load.js
 *
 * An non-visible component which loads the authorizations of the organization into the AuthorizationsRegistrar installed in organization.DYN.authorizations
 * - list: a ReactiveVar which contains the array of the authorizations
 * - byId( id<String> ): <Authorization>: a search function available at '<organization>.DYN.authorizations.byId()'
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

import './organization_authorizations_load.html';

Template.organization_authorizations_load.onCreated( function(){
    const edited = Template.currentData().item.get();
    const organization = TenantsManager.list.byEntity( edited._id );
    if( organization && organization.DYN.authorizations ){
        organization.DYN.authorizations.clientLoad();
    }
});
