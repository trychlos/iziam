/*
 * /imports/common/init/accounts-manager.js
 *
 * AccountsManager.Accounts instanciation for organizations users.
 * Defining here the standard users fieldset, which still be extended by the organizations.
 */

import { AccountsManager } from 'meteor/pwix:accounts-manager';

Meteor.APP.AccountsManager = Meteor.APP.AccountsManager || {};

Meteor.APP.AccountsManager.Users = new AccountsManager.amClass({
    collection: 'org_users'
});
