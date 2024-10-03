/*
 * /imports/server/init/tenants-manager.js
 */

import { TenantsManager } from 'meteor/pwix:tenants-manager';

import { ClientsRegistrar } from '/imports/common/classes/clients-registrar.class.js';
import { IdentitiesRegistrar } from '/imports/common/classes/identities-registrar.class.js';

import { Organizations } from '/imports/common/collections/organizations/index.js';

TenantsManager.configure({
    serverAllExtend: Organizations.s.tenantsAllExtend,
    serverTabularExtend: Organizations.s.tabularExtend
});

// at that time, package has been initialized (and configured, see above)
// item: the full entity tenant, with its DYN sub-object
const _onUpdate = function( item ){
    //console.debug( '_onUpdate', item );
    if( !item.DYN.clients ){
        item.DYN.clients = ClientsRegistrar.getRegistered( item ) || new ClientsRegistrar( item );
    }
    if( !item.DYN.identities ){
        item.DYN.identities = IdentitiesRegistrar.getRegistered( item ) || new IdentitiesRegistrar( item );
    }
};
TenantsManager.s.eventEmitter.on( 'item-update', _onUpdate );
