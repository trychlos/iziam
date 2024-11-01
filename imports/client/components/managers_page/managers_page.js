/*
 * /imports/client/components/managers_page/managers_page.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import '/imports/client/components/manager_accounts_tab/manager_accounts_tab.js';
import '/imports/client/components/manager_organizations_tab/manager_organizations_tab.js';

import './managers_page.html';
import './managers_page.less';

Template.managers_page.helpers({
    parmsTabbed(){
        return {
            tabs: [
                {
                    navLabel: pwixI18n.label( I18N, 'manager.accounts.tab_title' ),
                    paneTemplate: 'manager_accounts_tab'
                },
                {
                    navLabel: pwixI18n.label( I18N, 'manager.organizations.tab_title' ),
                    paneTemplate: 'manager_organizations_tab'
                }
            ],
            name: 'managers_page'
        }
    }
});
