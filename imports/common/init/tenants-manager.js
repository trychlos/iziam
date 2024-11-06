/*
 * /imports/common/init/tenants-manager.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Permissions } from 'meteor/pwix:permissions';
import { Roles } from 'meteor/pwix:roles';
import { TenantsManager } from 'meteor/pwix:tenants-manager';
import { Tracker } from 'meteor/tracker';

import { AuthorizationsRegistrar } from '/imports/common/classes/authorizations-registrar.class.js';
import { ClientsGroupsRegistrar } from '/imports/common/classes/clients-groups-registrar.class.js';
import { ClientsRegistrar } from '/imports/common/classes/clients-registrar.class.js';
import { IdentitiesGroupsRegistrar } from '/imports/common/classes/identities-groups-registrar.class.js';
import { IdentitiesRegistrar } from '/imports/common/classes/identities-registrar.class.js';
import { ResourcesRegistrar } from '/imports/common/classes/resources-registrar.class.js';

import { Organizations } from '/imports/common/collections/organizations/index.js';

TenantsManager.configure({
    allowFn: Permissions.isAllowed,
    //allowFn: null,
    hideDisabled: false,
    entityFields: Organizations.entityFieldset(),
    recordFields: Organizations.recordFieldset(),
    //recordFields: null,
    //scopedManagerRole: SCOPED_TENANT_MANAGER,
    //serverTabularExtend: null,
    tenantButtons: Organizations.tabularButtons(),
    //tenantButtons: null,
    tenantFields: Organizations.tabularFieldset(),
    //tenantFields: null,
    //verbosity: TenantsManager.C.Verbose.CONFIGURE
});

Permissions.set({
    pwix: {
        tenants_manager: {
            // display permissions to allow a new button, or whether to enable an edit or a delete button
            feat: {
                async delete( userId, item ){
                    return await Permissions.isAllowed( 'pwix.tenants_manager.fn.delete_tenant', userId, item );
                },
                async edit( userId, user ){
                    return await Roles.userIsInRoles( userId, 'TENANT_EDIT' );
                },
                async new( userId ){
                    return await Roles.userIsInRoles( userId, 'TENANT_CREATE' );
                }
            },
            entities: {
                fn: {
                    async get_by( userId, selector ){
                        return userId !== null;
                    },
                    async upsert( userId, item ){
                        return Permissions.isAllowed( 'pwix.tenants_manager.fn.upsert', userId, item );
                    }
                }
            },
            records: {
                fn: {
                    async get_by( userId, selector ){
                        return userId !== null;
                    },
                    async upsert( userId, item ){
                        return Permissions.isAllowed( 'pwix.tenants_manager.fn.upsert', userId, item );
                    }
                }
            },
            // server-side functions permissions
            //  even if they the very same than those of the client side, all the checks are to be revalidated
            fn: {
                async delete_tenant( userId, entity ){
                    return await Roles.userIsInRoles( userId, 'TENANT_DELETE' );
                },
                async get_scopes( userId ){
                    return userId !==  null;
                },
                async set_managers( userId, item ){
                    return userId !==  null;
                },
                async upsert( userId, item ){
                    return await Roles.userIsInRoles( userId, [ 'TENANT_CREATE', 'TENANT_EDIT' ]);
                }
            },
            pub: {
                async closests( userId ){
                    return await Permissions.isAllowed( 'pwix.tenants_manager.pub.list_all', userId );
                },
                async known_scopes( userId ){
                    return await Permissions.isAllowed( 'pwix.tenants_manager.fn.get_scopes', userId );
                },
                async list_all( userId ){
                    return await Roles.userIsInRoles( userId, 'TENANTS_MANAGER' );
                },
                async tabular( userId ){
                    return await Permissions.isAllowed( 'pwix.tenants_manager.pub.list_all', userId );
                }
            }
        }
    }
});

Tracker.autorun(() => {
    TenantsManager.list.get().forEach(( it ) => {
        it.DYN = it.DYN || {};
        // maintain the operational status of the organizations
        if( Meteor.isClient ){
            Organizations.setupOperational( it );
        }
        // instanciate a AuthorizationsRegistrar if needed
        if( !it.DYN.authorizations ){
            it.DYN.authorizations = AuthorizationsRegistrar.getRegistered( it ) || new AuthorizationsRegistrar( it );
        }
        // instanciate a ClientsRegistrar if needed
        if( !it.DYN.clients ){
            it.DYN.clients = ClientsRegistrar.getRegistered( it ) || new ClientsRegistrar( it );
        }
        // instanciate a ClientsGroupsRegistrar if needed
        if( !it.DYN.clients_groups ){
            it.DYN.clients_groups = ClientsGroupsRegistrar.getRegistered( it ) || new ClientsGroupsRegistrar( it );
        }
        // instanciate a IdentitiesRegistrar if needed
        if( !it.DYN.identities ){
            it.DYN.identities = IdentitiesRegistrar.getRegistered( it ) || new IdentitiesRegistrar( it );
        }
        // instanciate a IdentitiesGroupsRegistrar if needed
        if( !it.DYN.identities_groups ){
            it.DYN.identities_groups = IdentitiesGroupsRegistrar.getRegistered( it ) || new IdentitiesGroupsRegistrar( it );
        }
        // instanciate a ResourcesRegistrar if needed
        if( !it.DYN.resources ){
            it.DYN.resources = ResourcesRegistrar.getRegistered( it ) || new ResourcesRegistrar( it );
        }
    });
});
