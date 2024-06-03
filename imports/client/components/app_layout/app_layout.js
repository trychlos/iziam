/*
 * /imports/client/layouts/app_layout/app_layout.js
 *
 * Just below the app_main topmost component, this one takes care of:
 *  - display or not the application header
 *  - managing the app admin at startup if needed
 *  - managing the user login if needed
 *  - display or not the application footer
 *  - dynamically load the required template
 *  - automatically compute and provide a display layout adapted to the display size
 *  - manage the events which bubble up until here
 */

import _ from 'lodash';

import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Modal } from 'meteor/pwix:modal';

import '/imports/client/components/app_content/app_content.js';
import '/imports/client/components/app_footer/app_footer.js';
import '/imports/client/components/app_header/app_header.js';
import '/imports/client/components/app_saa/app_saa.js';
//import '/imports/client/components/app_login/app_login.js';
//import '/imports/client/components/app_page/app_page.js';
//import '/imports/client/components/app_serializer/app_serializer.js';
//import '/imports/client/components/app_tiers/app_tiers.js';
//import '/imports/client/components/app_tiers/app_saa.js';
//import '/imports/client/components/home_page/home_page.js';
import '/imports/client/components/managers_page/managers_page.js';
//import '/imports/client/components/organization_go/organization_go.js';
//import '/imports/client/components/organization_page/organization_page.js';
//import '/imports/client/components/organization_select/organization_select.js';

import './app_layout.html';

Template.app_layout.helpers({
    // write the name of the theme of the page as a class name
    colorTheme(){
        return Meteor.APP.runContext.page()?.get( 'colorTheme' ) || Meteor.APP.defaults.colorTheme;
    },

    // write the name of the theme of the page as a class name
    layoutTheme(){
        return Meteor.APP.runContext.page()?.get( 'layoutTheme' ) || Meteor.APP.defaults.layoutTheme;
    },

    // pass a running context to the below templates
    plainContext(){
        return Meteor.APP.runContext.plainContext();
    }
});

Template.app_layout.events({

    // click on a dropdown item
    'click .dropdown-item'( event, instance ){
        // if have an id, do we know it ?
        const id = $( event.currentTarget ).attr( 'id' );
        let done = false;
        switch( id ){
            case 'app-roles-item':
                Blaze.renderWithData( Template.prView, {
                    mdClassesContent: Meteor.APP.runContext.page().get( 'theme' ),
                }, $( 'body' )[0] );
                done = true;
                break;
        }
        // if we have 'item-user' or 'item-manager' classes
        if( !done && $( event.currentTarget ).hasClass( 'item-user' )){
            FlowRouter.go( id );
            done = true;
        }
        if( !done && $( event.currentTarget ).hasClass( 'item-manager' )){
            FlowRouter.go( id );
            done = true;
        }
        if( !done && $( event.currentTarget ).hasClass( 'item-modal' )){
            const page = Meteor.APP.displaySet.get( id );
            const parms = {
                mdBody: page.get( 'template' ),
                mdClasses: 'modal-lg',
                mdClassesContent: page.get( 'theme' )
            };
            const parms_a = page.get( 'templateParms' );
            const parms_b = parms_a ? ( _.isFunction( parms_a ) ? parms_a() : parms_a ) : null;
            if( parms_b ){
                _.merge( parms, parms_b );
            }
            Modal.run( parms );
            done = true;
        }
        // doesn't stop propagation to let Bootstrap close the menu
        //return !done;
    },

    // user asks for the cookies policy
    'cm-policy-click .cmSliding'( event, instance ){
        FlowRouter.go( 'lm_cookies' );
    }
});
