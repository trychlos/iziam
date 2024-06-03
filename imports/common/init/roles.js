/*
 * /imports/common/init/roles.js
 *
 *  Defines the roles used in the application, along with their hierarchy.
 */

import { Roles } from 'meteor/pwix:roles';

const roles = {
    hierarchy: [
        {
            // appAdmin may do anything in the application
            name: Meteor.APP.C.appAdmin,
            /*
            children: [
                {
                    // manage application user accounts
                    name: 'ACCOUNTS_MANAGER',
                    children: [
                        {
                            name: 'ACCOUNTS_LIST'
                        },
                        {
                            name: 'ACCOUNT_CRU'
                        },
                        {
                            name: 'ACCOUNT_DELETE'
                        }
                    ]
                },
                {
                    // manage organizations
                    name: 'ORG_MANAGER',
                    children: [
                        {
                            name: 'ORG_LIST'
                        },
                        {
                            name: 'ORG_CRU'
                        },
                        {
                            name: 'ORG_DELETE'
                        }
                    ]
                },
                {
                    name: 'PROVIDERS_MANAGER',
                    children: [
                        {
                            name: 'PROVIDERS_LIST'
                        }
                    ]
                }
            ]
            */
        },
        {
            // manage *one* (or several) organization (scoped role)
            name: 'ORG_SCOPED_MANAGER',
            scoped: true,
            /*
            children: [
                {
                    name: 'PROVIDERS_LIST'
                },
                {
                    name: 'AUTHORIZATIONS_MANAGER',
                    children: [
                        {
                            name: 'AUTHOR_LIST'
                        },
                        {
                            name: 'AUTHOR_CRU'
                        },
                        {
                            name: 'AUTHOR_DELETE'
                        }
                    ]
                },
                {
                    name: 'CLIENTS_MANAGER',
                    children: [
                        {
                            name: 'CLIENTS_LIST'
                        },
                        {
                            name: 'CLIENT_CRU'
                        },
                        {
                            name: 'CLIENT_DELETE'
                        }
                    ]
                },
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
            ]
            */
        }
    ]
};

Roles.configure({
    roles: roles,
    verbosity: Roles.C.Verbose.READY
    //verbosity: 65535
});
