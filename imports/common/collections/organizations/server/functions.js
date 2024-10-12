/*
 * /import/common/collections/organizations/server/functions.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { AccountsHub } from 'meteor/pwix:accounts-hub';
import { AccountsManager } from 'meteor/pwix:accounts-manager';
import { TenantsManager } from 'meteor/pwix:tenants-manager';

import { ClientsEntities } from '/imports/common/collections/clients_entities/index.js';
import { Groups } from '/imports/common/collections/groups/index.js';
import { Identities } from '/imports/common/collections/identities/index.js';

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
        //console.debug( 'onCorrelatedUpdateEvent', arguments );
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
        if( organizationEntityId ){
            TenantsManager.Entities.collection.updateAsync({ _id: organizationEntityId }, { $set: { witness_stamp: new Date() }});
        }
    },

    // extend the TenantsManager tabular publication
    // provide groupsCount, identitiesCount and clientsCount
    // item is a modified closest record
    async tabularExtend( item ){
        // count clients
        // there is one clients collection common to all organizations
        item.clientsCount = await ClientsEntities.collection.countDocuments({ organization: item.DYN.entity._id });
        // count groups
        // there is one groups collection common to all organizations
        item.groupsCount = await Groups.collection.countDocuments({ organization: item.DYN.entity._id });
        // count identities
        // there is one dedicated identities collection per organization 
        const instanceName = Identities.instanceName( item.DYN.entity._id );
        const amInstance = AccountsHub.instances[instanceName];
        if( amInstance ){
            assert( amInstance instanceof AccountsManager.amClass, 'expects an instance of AccountsManager.amClass, got '+amInstance );
            item.identitiesCount = await amInstance.collection().countDocuments();
        // a very frequent case where the class has not yet been instanciated - not an issue
        //} else {
        //    console.log( 'collection non defined', instanceName );
        }
        return true;
    },

    // extend the TenantsManager tenantsAll publication
    // provide groupsCount, identitiesCount and clientsCount
    // item is an entity with its DYN sub-object
    async tenantsAllExtend( item ){
        // count clients
        // there is one clients collection common to all organizations
        item.DYN.clientsCount = await ClientsEntities.collection.countDocuments({ organization: item._id });
        // count groups
        // there is one groups collection common to all organizations
        item.DYN.groupsCount = await Groups.collection.countDocuments({ organization: item._id });
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
        return true;
    }
};
