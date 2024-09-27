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

Permissions.set({
    pwix: {
        accounts_manager: {
            // display permissions to allow a new button, or whether to enable an edit or a delete button
            feat: {
                // whether the userId account can edit the user account
                //  user cannot edit an account which have higher roles, but can who has equal roles (so an admin may edit another admin)
                async edit( amInstance, userId, user ){
                    const compare = await Roles.compareLevels( userId, user );
                    const haveRole = await Roles.userIsInRoles( userId, 'ACCOUNT_EDIT' );
                    return compare >= 0 && haveRole;
                },
                async new( amInstance, userId ){
                    return await Roles.userIsInRoles( userId, 'ACCOUNT_CREATE' );
                }
            },
            // server-side functions permissions
            //  even if they are the very same than those of the client side, all the checks are to be revalidated
            fn: {
                // user cannot delete itself
                //  user cannot delete an account which have higher roles, but can who has equal roles (so an admin may delete another admin)
                async removeAccount( amInstance, userId, user ){
                    return await Roles.userIsInRoles( userId, 'ACCOUNT_DELETE' );
                },
                async updateAccount( amInstance, userId, user ){
                    return await Roles.userIsInRoles( userId, 'ACCOUNT_EDIT' );
                },
                // let any user update any of his own attributes
                async updateAttribute( amInstance, userId, user, modifier ){
                    return await Permissions.isAllowed( 'pwix.accounts_manager.fn.updateAccount', userId, user ) || AccountsHub.areSame( userId, user );
                }
            },
            pub: {
                async list_all( amInstance, userId ){
                    return await Roles.userIsInRoles( userId, 'ACCOUNTS_MANAGER' );
                }
            }
        }
    }
});
