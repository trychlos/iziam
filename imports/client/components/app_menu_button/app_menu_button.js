/*
 * /imports/client/components/app_menu_button/app_menu_button.js
 *
 * The toaster button which displays the full menu on rightest of the application header.
 * Event are managed in the 'app' layout template.
 * 
 * Note: on a small-size display, this menu also embeds login items.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { AccountsUI } from 'meteor/pwix:accounts-ui';
import { Permissions } from 'meteor/pwix:permissions';
import { pwixI18n } from 'meteor/pwix:i18n';
import { UILayout } from 'meteor/pwix:ui-layout';

import './app_menu_button.html';

Template.app_menu_button.onCreated( function(){
    const self = this;

    self.APP = {
        menuName: 'app_menu_button',
        menuUnits: new ReactiveVar( [], _.isEqual ),
    };

    // build the user menu
    //  set in this user menu only allowed items
    //  permissions are async, but we want keep the defined pages order
    self.autorun(() => {
        Meteor.APP.runContext.ipageableBuildMenu( self.APP.menuName ).then(( res ) => {
            self.APP.menuUnits.set( res );
        });
    });

    // track user menu content
    self.autorun(() => {
        //console.debug( 'menuUnits', self.APP.menuUnits.get());
    });
});

Template.app_menu_button.onRendered( function(){
    const self = this;

    // on small screens, we have this only single menu button
    // if a user is connected, replace the toaster image with the email address
    // just replace the whole HTML code of the button to prevent spurious effects when mixing with jQuery
    self.autorun(() => {
        const button = self.$( '.c-app-menu-button .dropdown button' );
        const btnClass = 'dropdown-toggle d-flex align-items-center';
        let html = '<span class="fa-solid fa-fw fa-bars"></span>';
        if( Meteor.userId() && UILayout.view() === UILayout.C.View.SM ){
            html = '<p>'+AccountsUI.User.firstEmailAddress()+'</p>';
            button.addClass( btnClass );
        } else {
            button.removeClass( btnClass );
        }
        button.html( html );
    });
});

Template.app_menu_button.helpers({
    // a class which qualify the item
    classes( it ){
        return it.get( 'classes' ).join( ' ' )+' item-user';
    },

    // text translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // returns the item label
    label( it ){
        return pwixI18n.label( I18N, it.get( 'menuLabel' ));
    },

    // returns a list of DisplayUnit items displayable in the top menu for a user
    //  the list has been built to only display the allowed items
    userMenu(){
        return Template.instance().APP.menuUnits.get();
    },

    // return the current version of the application
    version(){
        return( Meteor.settings.public[Meteor.APP.name].version );
    }
});
