/*
 * /imports/client/components/organization_identities_pane/organization_identities_pane.js
 *
 * Tabular display of the identities.
 * 
 * +- <this>
 *     |
 *     +- AccountNewButton
 *     |   |
 *     |   +-> trigger AccountEditPanel
 *     |
 *     +- AccountsList
 *         |
 *         +-> trigger AccountEditPanel
 *                      |
 *                      +- identity_profile_pane
 *                      |
 *                      +- identity_emails_pane
 *                      |
 *                      +- identity_usernames_pane
 *                      |
 *                      +- identity_addresses_pane
 *                      |
 *                      +- identity_phones_pane
 *                      |
 *                      +- identity_groups_pane
 *                      |
 *                      +- identity_password_pane
 *                      |
 *                      +- identity_no_pane
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization as an entity with its DYN.records array
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - entityTabs
 * - recordTabs
 */

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import { Identities } from '/imports/common/collections/identities/index.js';

import '/imports/client/components/identity_addresses_pane/identity_addresses_pane.js';
import '/imports/client/components/identity_authenticate_pane/identity_authenticate_pane.js';
import '/imports/client/components/identity_emails_pane/identity_emails_pane.js';
import '/imports/client/components/identity_groups_pane/identity_groups_pane.js';
import '/imports/client/components/identity_no_pane/identity_no_pane.js';
import '/imports/client/components/identity_phones_pane/identity_phones_pane.js';
import '/imports/client/components/identity_profile_pane/identity_profile_pane.js';
import '/imports/client/components/identity_usernames_pane/identity_usernames_pane.js';

import './organization_identities_pane.html';

Template.organization_identities_pane.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        amInstanceName: new ReactiveVar( null ),
        // new tabs for this identity
        tabsBefore: new ReactiveVar([
            {
                name: 'identity_profile_tab',
                navLabel: pwixI18n.label( I18N, 'identities.edit.profile_tab_title' ),
                paneTemplate: 'identity_profile_pane'
            },
            {
                name: 'identity_emails_tab',
                navLabel: pwixI18n.label( I18N, 'identities.edit.emails_tab_title' ),
                paneTemplate: 'identity_emails_pane'
            },
            {
                name: 'identity_usernames_tab',
                navLabel: pwixI18n.label( I18N, 'identities.edit.usernames_tab_title' ),
                paneTemplate: 'identity_usernames_pane'
            },
            {
                name: 'identity_addresses_tab',
                navLabel: pwixI18n.label( I18N, 'identities.edit.addresses_tab_title' ),
                paneTemplate: 'identity_addresses_pane'
            },
            {
                name: 'identity_phones_tab',
                navLabel: pwixI18n.label( I18N, 'identities.edit.phones_tab_title' ),
                paneTemplate: 'identity_phones_pane'
            },
            {
                name: 'identity_authenticate_tab',
                navLabel: pwixI18n.label( I18N, 'identities.edit.authenticate_tab_title' ),
                paneTemplate: 'identity_authenticate_pane'
            },
            {
                name: 'identity_groups_tab',
                navLabel: pwixI18n.label( I18N, 'identities.edit.groups_tab_title' ),
                paneTemplate: 'identity_groups_pane'
            },
            {
                name: 'identity_no_tab',
                paneTemplate: 'identity_no_pane',
                shown: false
            }
        ])
    };

    // set the organization record
    // and add it as a data context to the tabs
    self.autorun(() => {
        self.APP.tabsBefore.get().forEach(( it ) => {
            it.paneData = { organization: Template.currentData().item.get() };
        });
    });

    // make sure the AccountsManager is initialized before trying to instanciate it here
    // happens that the IdentitiesRegistrar is initialized, and the identities loaded, from the identities_load parallel tab
    // so we want wait for the new instance be registered before trying to display the AccountsList component
    // thus this ReactiveVar
    const name = Identities.instanceName( Template.currentData().item.get()._id );
    const obj = Meteor.setInterval(() => {
        if( AccountsHub.instances[name ] ){
            self.APP.amInstanceName.set( name );
            Meteor.clearInterval( obj );
        }
    }, 5 );
});

Template.organization_identities_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // AccountsList parameters and its additional tabs
    // item here is the tabular one
    parmsAccountsList(){
        return {
            name: Template.instance().APP.amInstanceName.get(),
            tabsBefore: Template.instance().APP.tabsBefore.get(),
            mdClasses: 'modal-xl',
            editTitle( item ){
                return pwixI18n.label( I18N, 'identities.edit.dialog_title', item.tabular_name );
            }
        };
    },

    // AccountNewButton parameters
    parmsNewAccount(){
        return {
            name: Template.instance().APP.amInstanceName.get(),
            tabsBefore: Template.instance().APP.tabsBefore.get(),
            shape: PlusButton.C.Shape.RECTANGLE,
            label: pwixI18n.label( I18N, 'identities.new.button_label' ),
            title: pwixI18n.label( I18N, 'identities.new.button_title' ),
            mdClasses: 'modal-xl',
            mdTitle: pwixI18n.label( I18N, 'identities.new.dialog_title' )
        }
    }
});
