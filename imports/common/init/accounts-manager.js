/*
 * /imports/common/init/accounts-manager.js
 */

import { AccountsManager } from 'meteor/pwix:accounts-manager';
import { Field } from 'meteor/pwix:field';
import { pwixI18n } from 'meteor/pwix:i18n';

AccountsManager.configure({
    fields: {
        where: Field.C.Insert.BEFORE,
        name: 'adminNotes',
        fields: [{
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
        }]
    },
    hideDisabled: false,
    roles: {
        list: 'ACCOUNTS_LIST',
        create: 'ACCOUNT_CREATE',
        edit: 'ACCOUNT_EDIT',
        delete: 'ACCOUNT_DELETE'
    }
    // verbosity: AccountsManager.C.Verbose.CONFIGURE
});
