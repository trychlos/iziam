/*
 * /imports/common/init/accounts-manager.js
 */

import { AccountsManager } from 'meteor/pwix:accounts-manager';
import { Field } from 'meteor/pwix:field';

AccountsManager.configure({
    fieldsSet: new Field.Set(
        {
            name: 'apiAllowed',
            type: Boolean,
            defaultValue: false
        }
    ),
    //haveEmailAddress: AC_FIELD_MANDATORY,
    //haveUsername: AC_FIELD_NONE
    hideDisabled: false,
    roles: {
        list: 'ACCOUNTS_LIST',
        create: 'ACCOUNT_CREATE',
        edit: 'ACCOUNT_EDIT',
        delete: 'ACCOUNT_DELETE'
    }
    // verbosity: AccountsManager.C.Verbose.CONFIGURE
});
