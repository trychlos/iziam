/*
 * /imports/client/contents/accounts_tab/accounts_tab.js
 *
 * Users management.
 * By 'users', one must understand izIAM's users, i.e. the user who want make a direct use of this application.
 * Because the application aims to be an identity manager, most of the persons who are referenced as an 'identified' person are not actual users.
 */

import { PlusButton } from 'meteor/pwix:plus-button';
import { pwixI18n } from 'meteor/pwix:i18n';

import './accounts_tab.html';

Template.accounts_tab.helpers({

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // AccountNewButton parameters
    parmsNewAccount(){
        return {
            shape: PlusButton.C.Shape.RECTANGLE
        }
    }
});
