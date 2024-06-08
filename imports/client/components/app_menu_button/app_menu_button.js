/*
 * /imports/client/components/app_menu_button/app_menu_button.js
 *
 * The toaster button which displays the full menu on rightest of the application header.
 * Event are managed in the 'app' layout template.
 * 
 * Note: on a small-size display, this menu also embeds login items.
 */

import { AccountsUI } from 'meteor/pwix:accounts-ui';
import { pwixI18n } from 'meteor/pwix:i18n';
import { Roles } from 'meteor/pwix:roles';
import { UILayout } from 'meteor/pwix:ui-layout';

import './app_menu_button.html';

Template.app_menu_button.onCreated( function(){
    const self = this;

    self.APP = {
        thisMenu: 'app_menu_button',
        userMenu: new ReactiveVar( [] ),
    };

    // build the user menu
    //  set in this user menu only allowed items
    self.autorun(() => {
        let pages = [];
        const userId = Meteor.userId();
        Meteor.APP.displaySet.enumerate(( name, page ) => {
            if( page.get( 'inMenus' ).includes( self.APP.thisMenu )
                && ( !page.get( 'rolesAccess' ).length || Roles.userIsInRoles( userId, page.get( 'rolesAccess' ), { anyScope: true }))
                //&& ( !page.wantScope() || Meteor.APP.OrganizationContext.currentReady())){
                && ( !page.wantScope())){

                    //console.debug( 'pushing', page );
                    pages.push( page );
            }
            return true;
        });
        self.APP.userMenu.set( pages );
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
        return Template.instance().APP.userMenu.get();
    },

    // return the current version of the application
    version(){
        return( Meteor.settings.public[Meteor.APP.name].version );
    }
});
