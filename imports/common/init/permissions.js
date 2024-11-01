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
import { strict as assert } from 'node:assert';

import { Permissions } from 'meteor/pwix:permissions';
import { Roles } from 'meteor/pwix:roles';

Permissions.configure({
    allowedIfTaskNotFound: false,
    //allowedIfTaskNotFound: true,
    //warnIfTaskNotFound: true,
    verbosity: Permissions.C.Verbose.CONFIGURE | Permissions.C.Verbose.NOT_ALLOWED
    //verbosity: Permissions.C.Verbose.CONFIGURE
});

// this is a specificity of this application to manage both
//  - application accounts
//  - external identities
// When the request comes from the REST API, we do not have an application account but an external identity.
// In this later case, 'user' is expected to be null.
// So the code put in opts a 'from' key which contains the organization identifier of the external identity.
// We consider that all the organization data is free to be read from any identity attached to this organization.
Permissions.set({
    feat: {
        authorizations: {
            async create( user, scope, opts={} ){
                return user ?
                    await Roles.userIsInRoles( user, 'AUTHORIZATIONS_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_AUTHORIZATION_CREATE', { scope: scope }) :
                    false;
            },
            async delete( user, scope, opts={} ){
                return user ?
                    await Roles.userIsInRoles( user, 'AUTHORIZATIONS_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_AUTHORIZATION_DELETE', { scope: scope }) :
                    false;
            },
            async edit( user, scope, opts={} ){
                return user ?
                    await Roles.userIsInRoles( user, 'AUTHORIZATIONS_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_AUTHORIZATION_EDIT', { scope: scope }) :
                    false;
            },
            async list( user, scope, opts={} ){
                return user ?
                    await Roles.userIsInRoles( user, 'AUTHORIZATIONS_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_AUTHORIZATION_LIST', { scope: scope }) :
                    opts.from === scope;
            }
        },
        clients: {
            async create( user, scope, opts={} ){
                return user ?
                    await Roles.userIsInRoles( user, 'CLIENTS_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_CLIENT_CREATE', { scope: scope }) :
                    false;
            },
            async delete( user, scope, opts={} ){
                return user ?
                    await Roles.userIsInRoles( user, 'CLIENTS_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_CLIENT_DELETE', { scope: scope }) :
                    false;
            },
            async edit( user, scope, opts={} ){
                return user ?
                    await Roles.userIsInRoles( user, 'CLIENTS_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_CLIENT_EDIT', { scope: scope }) :
                    false;
            },
            async list( user, scope, opts={} ){
                return user ?
                    await Roles.userIsInRoles( user, 'CLIENTS_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_CLIENTS_LIST', { scope: scope }) || true :
                    opts.from === scope;
            }
        },
        clients_groups: {
            async create( user, scope, opts={} ){
                return user ?
                    await Roles.userIsInRoles( user, 'CLIENTS_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_GROUP_CREATE', { scope: scope }) :
                    false;
            },
            async delete( user, scope, opts={} ){
                return user ?
                    await Roles.userIsInRoles( user, 'CLIENTS_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_GROUP_DELETE', { scope: scope }) :
                    false;
            },
            async edit( user, scope, opts={} ){
                return user ?
                    await Roles.userIsInRoles( user, 'CLIENTS_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_GROUP_EDIT', { scope: scope }) :
                    false;
            },
            async list( user, scope, opts={} ){
                return user ?
                    await Roles.userIsInRoles( user, 'CLIENTS_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_GROUPS_LIST', { scope: scope }) :
                    opts.from === scope;
            }
        },
        identities: {
            async create( user, scope, opts={} ){
                return user ?
                    await Roles.userIsInRoles( user, 'IDENTITIES_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_IDENTITY_CREATE', { scope: scope }) :
                    false;
            },
            async delete( user, scope, opts={} ){
                return user ?
                    await Roles.userIsInRoles( user, 'IDENTITIES_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_IDENTITY_DELETE', { scope: scope }) :
                    false;
            },
            async edit( user, scope, opts={} ){
                return user ?
                    await Roles.userIsInRoles( user, 'IDENTITIES_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_IDENTITY_EDIT', { scope: scope }) :
                    false;
            },
            async list( user, scope, opts={} ){
                return user ?
                    await Roles.userIsInRoles( user, 'IDENTITIES_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_IDENTITIES_LIST', { scope: scope }) :
                    opts.from === scope;
            }
        },
        identities_groups: {
            async create( user, scope, opts={} ){
                return user ?
                    await Roles.userIsInRoles( user, 'IDENTITIES_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_GROUP_CREATE', { scope: scope }) :
                    false;
            },
            async delete( user, scope, opts={} ){
                return user ?
                    await Roles.userIsInRoles( user, 'IDENTITIES_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_GROUP_DELETE', { scope: scope }) :
                    false;
            },
            async edit( user, scope, opts={} ){
                return user ?
                    await Roles.userIsInRoles( user, 'IDENTITIES_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_GROUP_EDIT', { scope: scope }) :
                    false;
            },
            async list( user, scope, opts={} ){
                return user ?
                    await Roles.userIsInRoles( user, 'IDENTITIES_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_GROUPS_LIST', { scope: scope }) :
                    opts.from === scope;
            }
        },
        organizations: {
            async edit( user, scope, opts={} ){
                return user ?
                    await Roles.userIsInRoles( user, 'TENANT_EDIT' ) || await Roles.userIsInRoles( user, 'SCOPED_TENANT_EDIT', { scope: scope }) :
                    false;
            },
            async new( user, scope, opts={} ){
                return user ?
                    await Roles.userIsInRoles( user, 'TENANT_CREATE' ) :
                    false;
            }
        },
        providers: {
            async list( user, scope, opts={} ){
                return user ?
                    await Roles.userIsInRoles( user, Meteor.APP.C.appAdmin ) :
                    opts.from === scope;
            }
        },
        resources: {
            async create( user, scope, opts={} ){
                return user ?
                    await Roles.userIsInRoles( user, 'RESOURCES_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_RESOURCE_CREATE', { scope: scope }) :
                    false;
            },
            async delete( user, scope, opts={} ){
                return user ?
                    await Roles.userIsInRoles( user, 'RESOURCES_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_RESOURCE_DELETE', { scope: scope }) :
                    false;
            },
            async edit( user, scope, opts={} ){
                return user ?
                    await Roles.userIsInRoles( user, 'RESOURCES_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_RESOURCE_EDIT', { scope: scope }) :
                    false;
            },
            async list( user, scope, opts={} ){
                return user ?
                    await Roles.userIsInRoles( user, 'RESOURCES_MANAGER' ) || await Roles.userIsInRoles( user, 'SCOPED_RESOURCE_LIST', { scope: scope }) :
                    opts.from === scope;
            }
        },
    },
    // the permissions needed to have an item in the specified menu
    menus: {
        app: {
            // application settings
            async settings( user, scope, opts={} ){
                return await Roles.userIsInRoles( user, Meteor.APP.C.appAdmin );
            }
        },
        // managers page (have accounts, tenants, providers)
        //  this is global app management
        async managers( user, scope, opts={} ){
            return await Roles.userIsInRoles( user, [ 'ACCOUNTS_MANAGER', 'TENANTS_MANAGER' ]);
        }
    }
});
