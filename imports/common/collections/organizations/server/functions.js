/*
 * /import/common/collections/organizations/server/functions.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { AccountsHub } from 'meteor/pwix:accounts-hub';
import { AccountsManager } from 'meteor/pwix:accounts-manager';
import { TenantsManager } from 'meteor/pwix:tenants-manager';

import { Authorizations } from '/imports/common/collections/authorizations/index.js';
import { ClientsEntities } from '/imports/common/collections/clients_entities/index.js';
import { ClientsGroups } from '/imports/common/collections/clients_groups/index.js';
import { Identities } from '/imports/common/collections/identities/index.js';
import { IdentitiesGroups } from '/imports/common/collections/identities_groups/index.js';
import { Resources } from '/imports/common/collections/resources/index.js';

import { Organizations } from '../index.js';

Organizations.s = {
    async getBy( selector, userId ){
        return await TenantsManager.Tenants.s.getBy( selector );
    },

    // a listener for create/update/delete events on AccountsManager
    //  from AccountsManager, we get an object with an amInstance key
    //  from Clients, we get an object with an entity key
    // Rationale: we update the witness timestamp of the organization each time something happens on one of the correlative collections
    //  (groups, identities, clients and so on). This way, organization is updated, publications are updated, and user interface can reflect
    //  the changes.
    onCorrelatedUpdateEvent( args ){
        console.debug( 'onCorrelatedUpdateEvent', args );
        let organizationEntityId = null;
        // coming from AccountsManager ?
        if( args && args.amInstance && _.isString( args.amInstance )){
            if( Identities.isIdentities( args.amInstance )){
                organizationEntityId = Identities.scope( args.amInstance );
            }
        }
        // coming from Clients ?
        if( args && args.entity ){
            organizationEntityId = args.entity.organization;
        }
        // coming from Groups or Resources ?
        if( args && args.organizationId ){
            organizationEntityId = args.organizationId;
        }
        // expects an organization identifier here
        if( organizationEntityId ){
            TenantsManager.Entities.collection.updateAsync({ _id: organizationEntityId }, { $set: { witness_stamp: new Date() }});
        }
    },

    // extend the TenantsManager tabular publication
    // provide groupsCount, identitiesCount and clientsCount
    // item is a modified closest record
    async tabularExtend( item ){
        //console.debug( 'item', item );
        // count authorizations
        // there is one authorization collection for each organization
        item.authorizationsCount = await Authorizations.collection( item.entity ).countDocuments({ organization: item.entity });
        // count clients
        // there is one clients collection common to all organizations
        item.clientsCount = await ClientsEntities.collection.countDocuments({ organization: item.entity });
        // count groups
        // there is one groups collection common to all organizations
        item.clientsGroupsCount = await ClientsGroups.collection( item.entity ).countDocuments({ organization: item.entity });
        item.identitiesGroupsCount = await IdentitiesGroups.collection( item.entity ).countDocuments({ organization: item.entity });
        // count identities
        // there is one dedicated identities collection per organization 
        const instanceName = Identities.instanceName( item.entity );
        const amInstance = AccountsHub.instances[instanceName];
        if( amInstance ){
            assert( amInstance instanceof AccountsManager.amClass, 'expects an instance of AccountsManager.amClass, got '+amInstance );
            item.identitiesCount = await amInstance.collection().countDocuments();
        // a very frequent case where the class has not yet been instanciated - not an issue
        //} else {
        //    console.log( 'collection non defined', instanceName );
        }
        // count resources
        // there is one groups collection common to all organizations
        item.resourcesCount = await Resources.collection( item.entity ).countDocuments({ organization: item.entity });
        return true;
    },

    // extend the TenantsManager tenantsAll publication
    // provide groupsCount, identitiesCount and clientsCount
    // item is an entity with its DYN sub-object
    async tenantsAllExtend( item ){
        // count authorizations
        // there is one authorization collection for each organization
        item.DYN.authorizationsCount = await Authorizations.collection( item._id ).countDocuments({ organization: item._id });
        // count clients
        // there is one clients collection common to all organizations
        item.DYN.clientsCount = await ClientsEntities.collection.countDocuments({ organization: item._id });
        // count groups
        // there is one groups collection common to all organizations
        item.DYN.clientsGroupsCount = await ClientsGroups.collection( item._id ).countDocuments({ organization: item._id });
        item.DYN.identitiesGroupsCount = await IdentitiesGroups.collection( item._id ).countDocuments({ organization: item._id });
        // count identities
        // there is one dedicated identities collection per organization 
        const instanceName = Identities.instanceName( item._id );
        const amInstance = AccountsHub.instances[instanceName];
        if( amInstance ){
            assert( amInstance instanceof AccountsManager.amClass, 'expects an instance of AccountsManager.amClass, got '+amInstance );
            item.DYN.identitiesCount = await amInstance.collection().countDocuments();
        // a very frequent case where the class has not yet been instanciated - not an issue
        //} else {
        //    console.log( 'collection non defined', instanceName );
        }
        // count resources
        // there is one resources collection for each organization
        item.DYN.resourcesCount = await Resources.collection( item._id ).countDocuments({ organization: item._id });
        return true;
    }
};
