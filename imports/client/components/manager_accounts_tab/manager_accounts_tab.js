/*
 * /imports/client/contents/manager_accounts_tab/manager_accounts_tab.js
 *
 * Users management.
 * By 'users', one must understand izIAM's users, i.e. the user who want make a direct use of this application.
 * Because the application aims to be an identity manager, most of the persons who are referenced as an 'identified' person are not actual izIAM users, but rather organizations users.
 */

import { PlusButton } from 'meteor/pwix:plus-button';
import { pwixI18n } from 'meteor/pwix:i18n';

import './manager_accounts_tab.html';

Template.manager_accounts_tab.onCreated( function(){
    const self = this;

    self.APP = {
        tabs: [
            {
                tabid: 'app_account_tab',
                paneid: 'app_account_pane',
                navLabel: pwixI18n.label( I18N, 'accounts.edit.tab_title' ),
                paneTemplate: 'account_edit_pane'
            }
        ]
    };
});

Template.manager_accounts_tab.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // AccountsList parameters and its additional tabs
    parmsAccountsList(){
        return {
            name: 'users',
            tabs: Template.instance().APP.tabs
        };
    },

    // AccountNewButton parameters
    parmsNewAccount(){
        return {
            name: 'users',
            tabs: Template.instance().APP.tabs,
            shape: PlusButton.C.Shape.RECTANGLE
        }
    }
});
