/*
 * /imports/common/init/accounts-manager-permissions.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Permissions } from 'meteor/pwix:permissions';
import { Roles } from 'meteor/pwix:roles';

import { Identities } from '/imports/common/collections/identities/index.js';

import '../collections/accounts/index.js';

Permissions.set({
    pwix: {
        accounts_manager: {
            // manage CRUD operations
            // args:
            //  - amInstance: the amClass instance, always present
            feat: {
                async create( userId, args ){
                    const instanceName = args.amInstance.name();
                    if( instanceName === 'users' ){
                        return await Roles.userIsInRoles( userId, 'ACCOUNT_CREATE' );
                    } else {
                        scope = Identities.scope( instanceName );
                        return await Roles.userIsInRoles( userId, 'SCOPED_IDENTITY_CREATE', { scope: scope }) || await Roles.userIsInRoles( userId, 'IDENTITIES_MANAGER' );
                    }
                },
                // user cannot delete itself
                //  user cannot delete an account which have higher roles, but can who has equal roles (so an admin may delete another admin)
                // args:
                //  - id: the target account identifier
                async delete( userId, args ){
                    return await Roles.userIsInRoles( userId, 'ACCOUNT_DELETE' );
                },
                // whether the userId account can edit the user account
                //  user cannot edit an account which have higher roles, but can who has equal roles (so an admin may edit another admin)
                // args:
                //  - id: the target account identifier
                async edit( userId, args ){
                    const compare = await Roles.compareLevels( userId, args.id );
                    const haveRole = await Roles.userIsInRoles( userId, 'ACCOUNT_EDIT' );
                    return compare >= 0 && haveRole;
                },
                // getBy can be used from server without any userId available
                async getBy( userId, args ){
                    return true;
                },
                async list( userId, args ){
                    const instanceName = args.amInstance.name();
                    if( instanceName === 'users' ){
                        return await Roles.userIsInRoles( userId, 'ACCOUNTS_LIST' );
                    } else {
                        const scope = Identities.scope( instanceName );
                        return await Roles.userIsInRoles( userId, 'SCOPED_IDENTITIES_LIST', { scope: scope }) || await Roles.userIsInRoles( userId, 'IDENTITIES_MANAGER' );
                    }
                }
            }
        }
    }
});
