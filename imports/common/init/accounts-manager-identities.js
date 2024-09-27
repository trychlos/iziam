/*
 * /imports/common/init/accounts-manager-identities.js
 *
 * AccountsManager.accounts instanciation for organizations users.
 * Defining here the standard users fieldset, which still be extended by the organizations.
 */

import { AccountsHub } from 'meteor/pwix:accounts-hub';
import { AccountsManager } from 'meteor/pwix:accounts-manager';
import { Permissions } from 'meteor/pwix:permissions';
import { Roles } from 'meteor/pwix:roles';
import { pwixI18n } from 'meteor/pwix:i18n';

import { Identities } from '/imports/common/collections/identities/index.js';

Meteor.APP.AccountsManager = Meteor.APP.AccountsManager || {};

Meteor.APP.AccountsManager.identities = new AccountsManager.amClass({
    name: Identities.collectionName,
    additionalFieldset: {
        fields: Identities.fieldsDef()
    },
    allowFn: Permissions.isAllowed,
    hideDisabled: false,
});

/*
Permissions.set({
    pwix: {
        accounts_manager: {
            // manage CRUD operations
            // args:
            //  - amInstance: the amClass instance, always present
            feat: {
                async create( userId, args ){
                    return await Roles.userIsInRoles( userId, 'ACCOUNT_CREATE' );
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
                async list( userId, args ){
                    return await Roles.userIsInRoles( userId, 'ACCOUNTS_LIST' );
                }
            }
        }
    }
});
*/
