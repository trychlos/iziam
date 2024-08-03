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
        providers: {
            async list( user ){
                return await Roles.userIsInRoles( user, Meteor.APP.C.appAdmin );
            }
        }
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
