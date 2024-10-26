/*
 * /imports/common/init/permissions.js
 *
 * Manage the permissions of a user.
 * 
 * Permissions are managed per task.
 * For each terminal node, the permission can be specified as: 
 * - an async function with proto: async fn( user<String|Object> ): Boolean
 * - a role name or a list of role names which are or-ed
 */

import _ from 'lodash';

import { Permissions } from 'meteor/pwix:permissions';
import { Roles } from 'meteor/pwix:roles';

Permissions.configure({
    allowedIfTaskNotFound: false,
    //allowedIfTaskNotFound: true,
    //warnIfTaskNotFound: true,
    verbosity: Permissions.C.Verbose.CONFIGURE | Permissions.C.Verbose.NOT_ALLOWED
    //verbosity: Permissions.C.Verbose.CONFIGURE
});

Permissions.set({
    feat: {
        authorizations: {
            async create( user, scope ){
                return await Roles.userIsInRoles( user, 'AUTHORIZATIONS_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_AUTHORIZATION_CREATE', { scope: scope });
            },
            async delete( user, scope ){
                return await Roles.userIsInRoles( user, 'AUTHORIZATIONS_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_AUTHORIZATION_DELETE', { scope: scope });
            },
            async edit( user, scope ){
                return await Roles.userIsInRoles( user, 'AUTHORIZATIONS_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_AUTHORIZATION_EDIT', { scope: scope });
            },
            async list( user, scope ){
                return await Roles.userIsInRoles( user, 'AUTHORIZATIONS_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_AUTHORIZATION_LIST', { scope: scope });
            }
        },
        clients: {
            async create( user, scope ){
                return await Roles.userIsInRoles( user, 'CLIENTS_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_CLIENT_CREATE', { scope: scope });
            },
            async delete( user, scope ){
                return await Roles.userIsInRoles( user, 'CLIENTS_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_CLIENT_DELETE', { scope: scope });
            },
            async edit( user, scope ){
                return await Roles.userIsInRoles( user, 'CLIENTS_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_CLIENT_EDIT', { scope: scope });
            },
            async list( user, scope ){
                return await Roles.userIsInRoles( user, 'CLIENTS_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_CLIENTS_LIST', { scope: scope });
            }
        },
        clients_groups: {
            async create( user, scope ){
                return await Roles.userIsInRoles( user, 'CLIENTS_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_GROUP_CREATE', { scope: scope });
            },
            async delete( user, scope ){
                return await Roles.userIsInRoles( user, 'CLIENTS_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_GROUP_DELETE', { scope: scope });
            },
            async edit( user, scope ){
                return await Roles.userIsInRoles( user, 'CLIENTS_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_GROUP_EDIT', { scope: scope });
            },
            async list( user, scope ){
                return await Roles.userIsInRoles( user, 'CLIENTS_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_GROUPS_LIST', { scope: scope });
            }
        },
        identities_groups: {
            async create( user, scope ){
                return await Roles.userIsInRoles( user, 'IDENTITIES_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_GROUP_CREATE', { scope: scope });
            },
            async delete( user, scope ){
                return await Roles.userIsInRoles( user, 'IDENTITIES_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_GROUP_DELETE', { scope: scope });
            },
            async edit( user, scope ){
                return await Roles.userIsInRoles( user, 'IDENTITIES_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_GROUP_EDIT', { scope: scope });
            },
            async list( user, scope ){
                return await Roles.userIsInRoles( user, 'IDENTITIES_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_GROUPS_LIST', { scope: scope });
            }
        },
        organizations: {
            async edit( user, scope ){
                return await Roles.userIsInRoles( user, 'TENANT_EDIT' ) ||
                        await Roles.userIsInRoles( user, 'SCOPED_TENANT_EDIT', { scope: scope });
            },
            async new( user, scope ){
                return await Roles.userIsInRoles( user, 'TENANT_CREATE' );
            }
        },
        providers: {
            async list( user ){
                return await Roles.userIsInRoles( user, Meteor.APP.C.appAdmin );
            }
        },
        resources: {
            async create( user, scope ){
                return await Roles.userIsInRoles( user, 'RESOURCES_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_RESOURCE_CREATE', { scope: scope });
            },
            async delete( user, scope ){
                return await Roles.userIsInRoles( user, 'RESOURCES_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_RESOURCE_DELETE', { scope: scope });
            },
            async edit( user, scope ){
                return await Roles.userIsInRoles( user, 'RESOURCES_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_RESOURCE_EDIT', { scope: scope });
            },
            async list( user, scope ){
                return await Roles.userIsInRoles( user, 'RESOURCES_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_RESOURCE_LIST', { scope: scope });
            }
        },
    },
    // the permissions needed to have an item in the specified menu
    menus: {
        app: {
            // application settings
            async settings( user ){
                return await Roles.userIsInRoles( user, Meteor.APP.C.appAdmin );
            }
        },
        // managers page (have accounts, tenants, providers)
        //  this is global app management
        async managers( user ){
            return await Roles.userIsInRoles( user, [ 'ACCOUNTS_MANAGER', 'TENANTS_MANAGER' ]);
        }
    }
});
