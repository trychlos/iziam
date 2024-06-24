/*
 * /imports/client/components/managers_page/managers_page.js
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import '/imports/client/components/accounts_tab/accounts_tab.js';
import '/imports/client/components/organizations_tab/organizations_tab.js';
//import '/imports/client/components/providers_tab/providers_tab.js';

import './managers_page.html';
import './managers_page.less';

Template.managers_page.helpers({
    parmsTabbed(){
        return {
            tabs: [
                {
                    navLabel: pwixI18n.label( I18N, 'accounts.manager.tab_title' ),
                    paneTemplate: 'accounts_tab'
                },
                {
                    navLabel: pwixI18n.label( I18N, 'organizations.manager.tab_title' ),
                    paneTemplate: 'organizations_tab'
                },
                {
                    navLabel: pwixI18n.label( I18N, 'providers.manager.tab_title' ),
                    paneTemplate: 'providers_tab'
                }
            ],
            name: 'managers_page'
        }
    }
});
