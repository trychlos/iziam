/*
 * /imports/common/init/accounts-manager.js
 *
 * AccountsManager package configuration.
 */

import { AccountsManager } from 'meteor/pwix:accounts-manager';

AccountsManager.configure({
    verbosity: 65535
    // verbosity: AccountsManager.C.Verbose.CONFIGURE
});
