/*
 * /imports/client/components/app_login/app_login.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { AccountsUI } from 'meteor/pwix:accounts-ui';
import { pwixI18n } from 'meteor/pwix:i18n';
import { UIU } from 'meteor/pwix:ui-utils';

import './app_login.html';

Template.app_login.onRendered( function(){
    const self = this;

    // when the user must log in, the acUserLogin doesn't take the focus
    //  this works (i.e. resolves with the INPUT element, but doesn't gain the focus either)
    UIU.DOM.waitFor( '.c-app-content .c-app-preamble .acUserLogin input' )
        .then(( res ) => { self.$( res ).focus(); });
});

Template.app_login.helpers({
    // returns the template to be used as the content
    //  doesn't complain if page is not yet set
    contentTemplate(){
        const _template = Meteor.APP.Pages.current.page().get( 'template' );
        const _wantScope = Meteor.APP.Pages.current.page().wantScope();
        if( _template ){
            console.log( 'rendering', _template, '(wantScope='+_wantScope+')' );
            return _template;
        }
    },

    // whether a user is actually connected
    isConnected(){
        return Meteor.userId() !== null;
    },

    // whether there is a current organization
    //  only relevant if the asked page is scoped
    orgCurrent(){
        const orgCurrent = Meteor.APP.OrganizationContext.currentClosest();
        return orgCurrent !== null;
    },

    // whether the allowed organizations are up to date
    orgReady(){
        return Meteor.APP.OrganizationContext.allowedReady();
    },

    // whether the currently logged-in user is allowed to work on several organizations
    //  he must choose one to work on
    orgSeveral(){
        const hasSeveral = Meteor.APP.OrganizationContext.allowed().length > 1;
        console.debug( 'orgSeveral', hasSeveral );
        return hasSeveral;
    },

    // select an organization
    parmsTiersSelect(){
        return {
            preamble: pwixI18n.label( I18N, 'organizations.select.preamble' ),
            image: '/images/organization-hq.svg',
            template: 'organization_go'
        };
    },

    // user connection
    parmsUserLogin(){
        console.debug( 'text', pwixI18n.label( I18N, 'accounts.login.preamble' ));
        return {
            initialDisplay: AccountsUI.C.Panel.SIGNIN,
            renderMode: AccountsUI.C.Render.DIV,
            haveCancelButton: false,
            signinLink: false,
            signupLink: false,
            signinTextOne: pwixI18n.label( I18N, 'accounts.login.preamble' ),
            resetLink: false,
            name: 'iziam:app-content:app-preamble:app-login'
        };
    },

    // does the asked route want a connected user ?
    wantConnection(){
        const wantPermission = Meteor.APP.runContext.ipageablePage().get( 'wantPermission' );
        return wantPermission;
    },

    // does the asked route is scoped ?
    //  or are the roles required by the page, and held by the user, themselves scoped ?
    wantScope(){
        const wantScope = Meteor.APP.Pages.current.page().wantScope();
        //console.debug( 'wantScope', wantScope );
        return wantScope;
    }
});
