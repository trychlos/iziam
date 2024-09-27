/*
 * /imports/client/components/organization_clients_load/organization_clients_load.js
 *
 * An non-visible component which loads the clients of the organization, creating a <organization>.DYN.clients object as:
 * - list: a ReactiveVar which contains the array of the clients
 * - byId( id<String> ): <Client>: a search function available at '<organization>.DYN.clients.byId()'
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization as an entity with its DYN.records array
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - entityTabs
 * - recordTabs
 */

import { ClientsRegistrar } from '/imports/common/classes/clients-registrar.class.js';

import './organization_clients_load.html';

Template.organization_clients_load.onCreated( function(){
    //console.debug( this );
    this.autorun(() => {
        const edited = Template.currentData().item.get();
        const organization = Meteor.APP.Organizations.byId( edited._id );
        if( organization && !organization.DYN.clients ){
            organization.DYN.clients = new ClientsRegistrar( organization );
        }
    })
});
