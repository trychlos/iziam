/*
 * /imports/common/init/accounts-conf.js
 */

import { AccountsConf } from 'meteor/pwix:accounts-conf';

// configure the AccountsConf package for production
AccountsConf.configure({
    //haveEmailAddress: AccountsConf.C.Identifier.MANDATORY,
    //haveUsername: AccountsConf.C.Identifier.NONE,
    //preferredLabel: AccountsConf.C.PreferredLabel.EMAIL_ADDRESS
    //verbosity: AccountsConf.C.Verbose.CONFIGURE
});
