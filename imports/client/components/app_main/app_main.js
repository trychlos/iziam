/*
 * /imports/client/components/app_main/app_main.js
 *
 * The (main) topmost component of the application UI:
 *  - get the window title from the settings
 *  - get back the data context as initialized by the router.
 *
 * General layout:
 * --------------
 *  +- app_main                         get default window title from settings for this environment
 *      |                               get data context passed in from this route through BlazeLayout
 *      |
 *      +- app_layout                   compute whether to display the header and the footer
 *          |                           manage the global theme
 *          |                           manage application-level menus
 *          |
 *          +- app_header
 *          |
 *          +- app_content              dynamically load the template depending of the connected user and the asked route
 *          |   |
 *          |   +- app_saa              manage startup-app-admin
 *          |   +- app_login            manage user login
 *          |
 *          +- app_footer
 */

import '/imports/client/components/app_layout/app_layout.js';

import './app_main.html';

Template.app_main.onCreated( function(){
    console.log( 'Template.app_main.onCreated()', this );
});

Template.app_main.onRendered( function(){
    console.log( 'Template.app_main.onRendered()' );
});

Template.app_main.helpers({
    // get back data passed from the router through BlazeLayout as a 'dataContext' object
    setDataContext( o ){
        console.log( 'Template.app_main.helpers.setDataContext()', o );
        Meteor.APP.runContext.dataContext( o );
    }
});

Template.app_main.onDestroyed( function(){
    console.log( 'Template.app_main.onDestroyed()' );
});
