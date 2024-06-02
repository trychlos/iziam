/*
 * /imports/client/components/app_header/app_header.js
 *
 *  Manage here the events of the menu button and of the menu header
 */

//import '/imports/client/components/app_menu_button/app_menu_button.js';
//import '/imports/client/components/edit_button/edit_button.js';
//import '/imports/client/components/organization_header/organization_header.js';
//import '/imports/client/components/organization_select/organization_select.js';
import '/imports/client/components/site_logo/site_logo.js';
//import '/imports/client/components/validities_select/validities_select.js';

import './app_header.html';

Template.app_header.helpers({
    // whether a user is actually connected
    //isConnected(){
    //    return Meteor.userId() !== null;
    //},

    // have a acUserLogin template to manage connection flows with default values
    //  this template is no more displayed in small screens
    parmsUserLogin(){
        return {
            name: 'izerm:app-header:user-login',
            loggedItemsAfter: Meteor.APP.AccountsUI.loggedItemsAfter(),
            mdClassesContent: Meteor.APP.runContext.page().get( 'theme' ),
        };
    }
});
