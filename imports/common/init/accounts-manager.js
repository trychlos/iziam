/*
 * /imports/common/init/accounts-manager.js
 *
 * AccountsManager package configuration.
 */

import { AccountsManager } from 'meteor/pwix:accounts-manager';

AccountsManager.configure({
    //classes: '',
    //datetime: '%Y-%m-%d %H:%M:%S',
    verbosity: 65535
    // verbosity: AccountsManager.C.Verbose.CONFIGURE
});
