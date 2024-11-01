/*
 * /imports/client/components/app_header/app_header.js
 *
 *  Manage here the events of the menu button and of the menu header
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { AccountsUI } from 'meteor/pwix:accounts-ui';
import { pwixI18n } from 'meteor/pwix:i18n';
import { UILayout } from 'meteor/pwix:ui-layout';

import '/imports/client/components/app_menu_button/app_menu_button.js';
//import '/imports/client/components/app_edit_button/app_edit_button.js';
//import '/imports/client/components/organization_header/organization_header.js';
//import '/imports/client/components/organization_select/organization_select.js';
import '/imports/client/components/site_logo/site_logo.js';
//import '/imports/client/components/validities_select/validities_select.js';

import './app_header.html';

Template.app_header.helpers({
    // whether a user is currently connected
    isConnected(){
        return Meteor.userId() !== null;
    },

    // arguments object for piLanguageSelector
    //  just the flag, not any label, on a small view
    parmsLanguageSelector(){
        let o = {
            languages: Meteor.APP.C.managedLanguages
        };
        if( !UILayout.isSM()){
            o.buttonLabel = pwixI18n.C.BtnLabel.LEFT;
        }
        //console.debug( 'parmsLanguageSelector', o );
        return o;
    },

    // have a acUserLogin template to manage connection flows with default values
    //  this template is no more displayed in small screens
    parmsUserLogin(){
        return {
            name: 'iziam:app-header:user-login',
            initialDisplay: AccountsUI.C.Display.DROPDOWNBUTTON,
            loggedItemsAfter: Meteor.APP.AccountsUI.loggedItemsAfter(),
            mdClassesContent: Meteor.APP.runContext.pageUIClasses().join( ' ' ),
        };
    },

    // the application title to be displayed in the page header
    title(){
        return Meteor.APP.runContext.title();
    },

    // whether we want display the page header
    wantHeader(){
        return Meteor.APP.runContext.wantHeader();
    }
});
