/*
 * /import/common/collections/organizations/server/functions.js
 */

const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { AccountsHub } from 'meteor/pwix:accounts-hub';
import { AccountsManager } from 'meteor/pwix:accounts-manager';
import { TenantsManager } from 'meteor/pwix:tenants-manager';

import { ClientsEntities } from '/imports/common/collections/clients_entities/index.js';
import { Identities } from '/imports/common/collections/identities/index.js';

import { Organizations } from '../index.js';

Organizations.s = {
    async getBy( selector, userId ){
        return await TenantsManager.Tenants.s.getBy( selector );
    },

    // extend the TenantsManager tabular publish function
    // provide identitiesCount and clientsCount
    async tabularExtend( item ){
        // count identities
        // there is one dedicated identities collection per organization 
        const instanceName = Identities.instanceName( item.DYN.entity._id );
        const amInstance = AccountsHub.instances[instanceName];
        if( amInstance ){
            assert( amInstance instanceof AccountsManager.amClass, 'expects an instance of AccountsManager.amClass, got '+amInstance );
            item.identitiesCount = await amInstance.collection().countDocuments();
        } else {
            console.log( 'collection non defined', instanceName );
        }
        // count clients
        // there is one clients collection common to all organizations
        item.clientsCount = await ClientsEntities.collection.countDocuments({ organization: item.DYN.entity._id });
        return true;
    }
};
