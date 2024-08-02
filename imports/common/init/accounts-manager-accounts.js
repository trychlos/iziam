/*
 * /imports/common/init/accounts-manager.js
 *
 * AccountsManager.Accounts instanciation for izIAM internal accounts.
 */

import strftime from 'strftime';

import { AccountsManager } from 'meteor/pwix:accounts-manager';
import { AccountsTools } from 'meteor/pwix:accounts-tools';
import { Permissions } from 'meteor/pwix:permissions';
import { Roles } from 'meteor/pwix:roles';
import { pwixI18n } from 'meteor/pwix:i18n';

import { Accounts } from '../collections/accounts/index.js';

import '../collections/accounts/index.js';

Meteor.APP.AccountsManager = Meteor.APP.AccountsManager || {};

Meteor.APP.AccountsManager.Accounts = new AccountsManager.amClass({
    additionalFieldset: {
        before: 'adminNotes',
        fields: [{
            // whether the account is allowed to use the REST API
            name: 'apiAllowed',
            type: Boolean,
            defaultValue: false,
            dt_title: pwixI18n.label( I18N, 'fieldset.api_allowed_dt_title' ),
            dt_template: 'dt_checkbox',
            dt_className: 'dt-center',
            dt_templateContext( rowData ){
                return {
                    item: rowData,
                    readonly: true,
                    enabled: true
                };
            },
            form_status: false,
            form_check: Accounts.checks.apiAllowed
        },{
            // last API connection
            name: 'apiConnection',
            type: Date,
            optional: true,
            dt_title: pwixI18n.label( I18N, 'fieldset.api_connection_dt_title' ),
            dt_render( data, type, rowData ){
                return rowData.apiConnection ? strftime( AccountsManager.configure().datetime, rowData.lastConnection ) : '';
            },
            dt_className: 'dt-center',
            form_status: false,
            form_check: false
        }]
    },
    allowFn: Permissions.isAllowed,
    hideDisabled: false,
    //hideDisabled: true,
    //tabularActiveCheckboxes: false,
    // verbosity: AccountsManager.C.Verbose.CONFIGURE
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
                    return await Permissions.isAllowed( 'pwix.accounts_manager.fn.updateAccount', userId, user ) || AccountsTools.areSame( userId, user );
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
