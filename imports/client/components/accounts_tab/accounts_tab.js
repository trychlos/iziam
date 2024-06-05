/*
 * /imports/client/contents/accounts_tab/accounts_tab.js
 *
 * Users management.
 * By 'users', one must understand izIAM's users, i.e. the user who want make use of this application.
 * Because the application aims to be an identity manager, most of the persons who are referenced as an 'identified' person do not are actual users.
 */

import { AccountsList } from 'meteor/pwix:accounts-list';
import { Bootbox } from 'meteor/pwix:bootbox';
import { CoreApp } from 'meteor/pwix:core-app';
import { Modal } from 'meteor/pwix:modal';
import { PlusButton } from 'meteor/pwix:plus-button';
import { pwixI18n } from 'meteor/pwix:i18n';
import { Roles as alRoles } from 'meteor/alanning:roles';
import { Roles } from 'meteor/pwix:roles';
import { Tolert } from 'meteor/pwix:tolert';

//import '/imports/client/components/account_edit/account_edit.js';

//import '/imports/client/jquery/jqw-table/jqw-table.js';

import './accounts_tab.html';

Template.accounts_tab.onCreated( function(){
});

Template.accounts_tab.onRendered( function(){
});

Template.accounts_tab.helpers({

    // whether the current user is allowed to define a new account
    havePlusButton(){
        return Meteor.userId() && alRoles.userIsInRole( Meteor.userId(), 'ACCOUNT_CRU' );
    },

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // count of known accounts
    itemsCount(){
        //const count = Template.instance().APP.accounts.list.get().length;
        //return pwixI18n.label( I18N, 'accounts.manager.total_count', count );
    },

    // only APP_ADMINISTRATOR should have access to this page
    //  check anyway that we have the ACCOUNTS_LIST permission
    listAllowed(){
        const allowed = Meteor.userId() && Roles.userIsInRoles( Meteor.userId(), 'ACCOUNTS_LIST' );
        console.debug( 'allowed', allowed );
        return allowed;
    },

    // AccountsList parameters
    parmsAccountsList(){
        return {};
    },

    // plusButton parameters
    parmsPlusButton(){
        return {
            shape: PlusButton.C.Shape.RECTANGLE,
            label: pwixI18n.label( I18N, 'accounts.manager.btn_plus_label' ),
            title: pwixI18n.label( I18N, 'accounts.manager.btn_plus_title' )
        }
    }
});

Template.accounts_tab.events({
    // delete a user
    'click button.js-delete'( event, instance ){
        const id = $( event.currentTarget ).data( 'app-id' );
        const user = instance.APP.user( id );
        const email = instance.APP.email( user );
        Bootbox.confirm({
            title: pwixI18n.label( I18N, 'accounts.manager.delete_title' ),
            message: pwixI18n.label( I18N, 'accounts.manager.delete_confirm', email ),
            mdClassesContent: Meteor.APP.Pages.current.page().get( 'theme' )
        }, function( ret ){
                if( ret ){
                    Meteor.call( 'account.remove', id, ( e, res ) => {
                        if( e ){
                            Tolert.error({ type:e.error, message:e.reason });
                        } else {
                            Tolert.success( pwixI18n.label( I18N, 'accounts.manager.delete_success', email ));
                        }
                    });
                }
            }
        );
        return false;
    },

    // edit an account
    'click .js-edit'( event, instance ){
        //console.log( event );
        const id = $( event.currentTarget ).data( 'app-id' );
        Modal.run({
            mdBody: 'account_edit',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-lg',
            mdClassesContent: Meteor.APP.Pages.current.page().get( 'theme' ),
            mdTitle: pwixI18n.label( I18N, 'accounts.manager.edit_title' ),
            item: instance.APP.user( id )
        });
        return false;
    },

    // add an account
    'click .plusButton'( event, instance ){
        //console.log( event );
        Modal.run({
            mdBody: 'account_edit',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-lg',
            mdClassesContent: Meteor.APP.Pages.current.page().get( 'theme' ),
            mdTitle: pwixI18n.label( I18N, 'accounts.manager.new_title' ),
            item: null
        });
        return false;
    },

    // edit the roles
    'click button.js-roles'( event, instance ){
        //console.log( event );
        const id = $( event.currentTarget ).data( 'app-id' );
        const user = instance.APP.user( id );
        Blaze.renderWithData( Template.prEdit, {
            user:user,
            roles:user.attributedRoles,
            mdClassesContent: Meteor.APP.Pages.current.page().get( 'theme' ),
        }, $( 'body' )[0] );
        return false;
    },

    // re-send a verification mail
    'click button.js-verify'( event, instance ){
        //console.log( event );
        const id = $( event.currentTarget ).data( 'app-id' );
        Meteor.call( 'pwixAccounts.sendVerificationEmail', id );
        tlTolert.success( 'accounts.manager.verify_sent' );
        return false;
    },

    'click input.verified'( event, instance ){
        //console.log( event );
        const checked = $( event.currentTarget ).is( ':checked' );
        //console.log( 'isChecked='+checked );
        const id = $( event.currentTarget ).parents( 'tr' ).attr( 'data-row-id' );
        const user = instance.APP.user( id );
        const email = instance.APP.email( user );
        //console.log( 'id='+id );
        Meteor.call( 'account.setVerified', id, checked, (err, res ) => {
            if( err ){
                console.error( err );
            } else {
                Tolert.success( pwixI18n.label( I18N, checked ? 'accounts.manager.set_verified_true' : 'accounts.manager.set_verified_false', email ));
            }
        });
    },

    // there is no need to take attention to not disallow myself as the checkbox is disabled for current user (but just in case...)
    'click input.allowed'( event, instance ){
        const id = $( event.currentTarget ).parents( 'tr' ).attr( 'data-row-id' );
        if( id !== Meteor.userId()){
            const checked = $( event.currentTarget ).is( ':checked' );
            const o = {
                isAllowed: checked
            };
            Meteor.call( 'account.setAttribute', id, o, ( err, res ) => {
                if( err ){
                    console.error( err );
                } else {
                    const user = instance.APP.user( id );
                    const email = instance.APP.email( user );
                    Tolert.success( pwixI18n.label( I18N, checked ? 'accounts.manager.set_allowed_true' : 'accounts.manager.set_allowed_false', email ));
                }
            });
        }
    },

    'click input.api-allowed'( event, instance ){
        const id = $( event.currentTarget ).parents( 'tr' ).attr( 'data-row-id' );
        const checked = $( event.currentTarget ).is( ':checked' );
        const o = {
            apiAllowed: checked
        };
        Meteor.call( 'account.setAttribute', id, o, ( err, res ) => {
            if( err ){
                console.error( err );
            } else {
                const user = instance.APP.user( id );
                const email = instance.APP.email( user );
                Tolert.success( pwixI18n.label( I18N, checked ? 'accounts.manager.set_api_allowed_true' : 'accounts.manager.set_api_allowed_false', email ));
            }
        });
    }
});
