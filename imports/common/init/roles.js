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
                    name: 'PROVIDERS_MANAGER',
                    children: [
                        {
                            name: 'PROVIDERS_LIST'
                        }
                    ]
                },
                {
                    name: 'EDITOR',
                },
                {
                    // manage *one* (or several) organization (scoped role)
                    name: 'ORG_SCOPED_MANAGER',
                    scoped: true,
                    children: [
                        {
                            name: 'SCOPED_PROVIDERS_MANAGER',
                            children: [
                                {
                                    name: 'SCOPED_PROVIDERS_LIST'
                                }
                            ]
                        },
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
                            name: 'SCOPED_EDITOR',
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
                            /*
                        {
                            name: 'IDENTITIES_MANAGER',
                            children: [
                                {
                                    name: 'GROUPS_LIST'
                                },
                                {
                                    name: 'GROUP_CRU'
                                },
                                {
                                    name: 'GROUP_DELETE'
                                },
                                {
                                    name: 'IDENT_LIST'
                                },
                                {
                                    name: 'IDENT_CRU'
                                },
                                {
                                    name: 'IDENT_DELETE'
                                },
                                {
                                    name: 'MEMBER_LIST'
                                },
                                {
                                    name: 'MEMBER_CRU'
                                },
                                {
                                    name: 'MEMBER_DELETE'
                                }
                            ]
                        },
                        {
                            name: 'RESOURCES_MANAGER',
                            children: [
                                {
                                    name: 'RES_LIST'
                                },
                                {
                                    name: 'RES_CRU'
                                },
                                {
                                    name: 'RES_DELETE'
                                }
                            ]
                        }
                    */
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
