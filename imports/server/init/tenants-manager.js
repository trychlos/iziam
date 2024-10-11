/*
 * /imports/server/init/tenants-manager.js
 */

import { TenantsManager } from 'meteor/pwix:tenants-manager';
import { Tracker } from 'meteor/tracker';

import { ClientsRegistrar } from '/imports/common/classes/clients-registrar.class.js';
import { IdentitiesRegistrar } from '/imports/common/classes/identities-registrar.class.js';

import { Organizations } from '/imports/common/collections/organizations/index.js';

// server-side only configuration
TenantsManager.configure({
    serverAllExtend: Organizations.s.tenantsAllExtend,
    serverTabularExtend: Organizations.s.tabularExtend
});

// maintains the ClientsRegistrar and the IdentitiesRegistrar for each organization
Tracker.autorun(() => {
    TenantsManager.list.get().forEach(( it ) => {
        if( !it.DYN.clients ){
            it.DYN.clients = ClientsRegistrar.getRegistered( it ) || new ClientsRegistrar( it );
        }
        if( !it.DYN.identities ){
            it.DYN.identities = IdentitiesRegistrar.getRegistered( it ) || new IdentitiesRegistrar( it );
        }
    });
});
