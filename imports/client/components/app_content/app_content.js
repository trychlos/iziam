/*
 * /imports/client/components/app_content/app_content.js
 *
 * Compute and render the to-be-displayed template.
 * 
 * The HTML is very simple: render the computed template with the computed data (if any).
 * All the logic is built with ReactiveVar's:
 * - whether we already have an app admin or not
 * - whether the requester route wants a connection, or a particular role
 * 
 * Data context (inherited from app_saa):
 * - runContext = RunContext.plainContext()
 */

import { AppPages } from 'meteor/pwix:app-pages';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { UIU } from 'meteor/pwix:ui-utils';

import './app_content.html';

Template.app_content.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        template: new ReactiveVar( null ),
        data: new ReactiveVar( null )
    };

    // track the runContext to compute the to-be-displayed template
    self.autorun(() => {
        if( Meteor.APP.runContext.isaaWantDisplay()){
            self.APP.template.set( 'app_saa' );
        } else {
            self.APP.template.set( Meteor.APP.runContext.ipageablePage().get( 'template' ));
        }
    });
});

Template.app_content.onRendered( function(){
    const self = this;

    // when the user must log in, the acUserLogin doesn't take the focus
    //  this works (i.e. resolves with the INPUT element, but doesn't gain the focus either)
    UIU.DOM.waitFor( '.c-app-content .user-login .acUserLogin input' )
        .then(( res ) => { self.$( res ).focus(); });
});

Template.app_content.helpers({
    // returns the template to be used as the content
    //  doesn't complain if page is not yet set
    contentTemplate(){
        const page = Meteor.APP.runContext.page();
        let template = '';
        if( page ){
            check( page, AppPages.DisplayUnit );
            template = page.get( 'template' );
        }
        //console.debug( 'template', template );
        return template;
    },

    // the computed data context, defaulting to this current data context
    data(){
        let data = Template.instance().APP.data.get();
        if( !data ){
            data = this;
        }
        return data;
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

    // the computed template
    template(){
        const template = Template.instance().APP.template.get();
        return template;
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
