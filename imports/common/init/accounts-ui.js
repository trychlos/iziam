/*
 * /imports/common/init/accounts-ui.js
 */

import { AccountsUI } from 'meteor/pwix:accounts-ui';
import { pwixI18n } from 'meteor/pwix:i18n';

// configure the AccountsUI package for production
AccountsUI.configure({
    //haveEmailAddress: AC_FIELD_MANDATORY,
    //haveUsername: AC_FIELD_NONE
});

// provides the item to be added to acUserLogin logged/unlogged (client) menus
// please note that the 'click' event should be handled at layout level
if( Meteor.isClient ){
    Meteor.APP.AccountsUI = {
        loggedItemsAfter(){
            return [
                '<hr class="dropdown-divider" />',
                '<a class="dropdown-item d-flex align-items-center justify-content-start" id="app-roles-item" href="#">'
                    + '<span class="fa-solid fa-fw fa-user-shield"></span>'
                    + '<p>'+pwixI18n.label( I18N, 'header.my_roles' )+'</p>'
                    + '</a>'
            ];
        }
    }
}
