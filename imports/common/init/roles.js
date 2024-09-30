/*
 * /imports/common/init/roles.js
 *
 *  Defines the roles used in the application, along with their hierarchy.
 */

import { Permissions } from 'meteor/pwix:permissions';
import { Roles } from 'meteor/pwix:roles';

const roles = {
    hierarchy: [
        {
            // appAdmin may do anything in the application
            name: Meteor.APP.C.appAdmin,
            children: [
                {
                    // manage application user accounts
                    name: 'ACCOUNTS_MANAGER',
                    children: [
                        {
                            name: 'ACCOUNT_CREATE'
                        },
                        {
                            name: 'ACCOUNT_DELETE'
                        },
                        {
                            name: 'ACCOUNT_EDIT'
                        },
                        {
                            name: 'ACCOUNTS_LIST'
                        }
                    ]
                },
                {
                    // manage organizations
                    name: 'TENANTS_MANAGER',
                    children: [
                        {
                            name: 'TENANT_CREATE'
                        },
                        {
                            name: 'TENANT_DELETE'
                        },
                        {
                            name: 'TENANT_EDIT'
                        },
                        {
                            name: 'TENANTS_LIST'
                        },
                    ]
                },
                {
                    // manage the clients for all organizations (e.g. a support service)
                    name: 'CLIENTS_MANAGER'
                },
                {
                    // manage the identities for all organizations (e.g. a support service)
                    name: 'IDENTITIES_MANAGER'
                },
                {
                    // manage *one* (or several) organization (scoped role)
                    name: 'SCOPED_TENANT_MANAGER',
                    scoped: true,
                    children: [
                        {
                            name: 'SCOPED_AUTHORIZATIONS_MANAGER',
                            children: [
                                {
                                    name: 'SCOPED_AUTHORIZATION_CREATE'
                                },
                                {
                                    name: 'SCOPED_AUTHORIZATION_DELETE'
                                },
                                {
                                    name: 'SCOPED_AUTHORIZATION_EDIT'
                                },
                                {
                                    name: 'SCOPED_AUTHORIZATION_LIST'
                                }
                            ]
                        },
                        {
                            name: 'SCOPED_CLIENTS_MANAGER',
                            children: [
                                {
                                    name: 'SCOPED_CLIENT_CREATE'
                                },
                                {
                                    name: 'SCOPED_CLIENT_DELETE'
                                },
                                {
                                    name: 'SCOPED_CLIENT_EDIT'
                                },
                                {
                                    name: 'SCOPED_CLIENTS_LIST'
                                }
                            ]
                        },
                        {
                            name: 'SCOPED_IDENTITIES_MANAGER',
                            children: [
                                {
                                    name: 'SCOPED_GROUP_CREATE'
                                },
                                {
                                    name: 'SCOPED_GROUP_DELETE'
                                },
                                {
                                    name: 'SCOPED_GROUP_EDIT'
                                },
                                {
                                    name: 'SCOPED_GROUPS_LIST'
                                },
                                {
                                    name: 'SCOPED_IDENTITY_CREATE'
                                },
                                {
                                    name: 'SCOPED_IDENTITY_EDIT'
                                },
                                {
                                    name: 'SCOPED_IDENTITY_DELETE'
                                },
                                {
                                    name: 'SCOPED_IDENTITIES_LIST'
                                }
                            ]
                        },
                        {
                            name: 'SCOPED_RESOURCES_MANAGER',
                            children: [
                                {
                                    name: 'SCOPED_RESOURCE_CREATE'
                                },
                                {
                                    name: 'SCOPED_RESOURCE_EDIT'
                                },
                                {
                                    name: 'SCOPED_RESOURCE_DELETE'
                                },
                                {
                                    name: 'SCOPED_RESOURCES_LIST'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

Roles.configure({
    allowFn: Permissions.isAllowed,
    //allowFn: null,
    //maintainHierarchy: true,
    roles: roles,
    //roles: null,
    //scopeLabelFn: null,
    //scopesFn: null,
    scopesPub: 'pwix_tenants_manager_tenants_get_scopes',
    //scopesPub: null,
    verbosity: Roles.C.Verbose.CONFIGURE | Roles.C.Verbose.READY | Roles.C.Verbose.CURRENT
    //verbosity: Roles.C.Verbose.CONFIGURE
});

Permissions.set( Roles.suggestedPermissions());
