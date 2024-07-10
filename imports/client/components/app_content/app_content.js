/*
 * /imports/client/components/app_content/app_content.js
 *
 * Force the user to log in.
 * 
 * Data context (inherited from app_saa):
 * - runContext = RunContext.plainContext()
 */

import { CoreApp } from 'meteor/pwix:core-app';
import { pwixI18n } from 'meteor/pwix:i18n';

import './app_content.html';

Template.app_content.onRendered( function(){
    const self = this;

    // when the user must log in, the acUserLogin doesn't take the focus
    //  this works (i.e. resolves with the INPUT element, but doesn't gain the focus either)
    CoreApp.DOM.waitFor( '.c-app-content .user-login .acUserLogin input' )
        .then(( res ) => { self.$( res ).focus(); });
});

Template.app_content.helpers({
    // returns the template to be used as the content
    //  doesn't complain if page is not yet set
    contentTemplate(){
        const page = Meteor.APP.runContext.page();
        let template = '';
        if( page ){
            check( page, CoreApp.DisplayUnit );
            template = page.get( 'template' );
        }
        //console.debug( 'template', template );
        return template;
    },

    // whether a user is currently connected
    isConnected(){
        return Meteor.APP.runContext.isConnected();
    },

    // whether there is a current organization
    //  only relevant if the asked page is scoped
    orgCurrent(){
        //const orgCurrent = Meteor.APP.OrganizationContext.currentClosest();
        return false; // orgCurrent !== null;
    },

    // whether the allowed organizations are up to date
    orgReady(){
        return false; // Meteor.APP.OrganizationContext.allowedReady();
    },

    // whether the currently logged-in user is allowed to work on several organizations
    //  he must choose one to work on
    orgSeveral(){
        //const hasSeveral = Meteor.APP.OrganizationContext.allowed().length > 1;
        //console.debug( 'orgSeveral', hasSeveral );
        return false; // hasSeveral;
    },

    // user connection
    parmsTiersLogin(){
        return {
            preamble: pwixI18n.label( I18N, 'accounts.login.preamble' ),
            image: '/images/login-image.svg',
            template: 'app_login'
        };
    },

    // select an organization
    parmsTiersSelect(){
        return {
            preamble: pwixI18n.label( I18N, 'organizations.select.preamble' ),
            image: '/images/organization-hq.svg',
            template: 'organization_go'
        };
    },

    // does the asked route want a connected user ?
    wantConnection(){
        const wantPermission = Meteor.APP.runContext.page()?.get( 'wantPermission' ) || null;
        return wantPermission !== null;
    },

    // does the asked route is scoped ?
    //  or are the roles required by the page themselves scoped ?
    wantScope(){
        const page = Meteor.APP.runContext.page();
        const wantScope = page ? page.wantScope() : false;
        //console.debug( 'wantScope', wantScope );
        return wantScope;
    }
});
