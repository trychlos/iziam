/*
 * /imports/client/components/organization_identities_pane/organization_identities_pane.js
 *
 * Display the identities.
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

import '/imports/client/components/identity_profile_pane/identity_profile_pane.js';

import './organization_identities_pane.html';

Template.organization_identities_pane.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        organization: new ReactiveVar( null ),
        amInstanceName: new ReactiveVar( null ),
        // new tabs for this identity
        tabsBefore: [
            {
                name: 'identity_profile_tab',
                navLabel: pwixI18n.label( I18N, 'identities.edit.profile_tab_title' ),
                paneTemplate: 'identity_profile_pane'
            }
        ],
        // update the standard tabs
        tabsUpdates: {
            account_ident_tab: {
                navLabel: pwixI18n.label( I18N, 'identities.edit.ident_tab_title' )
            }
        }
    };

    // set the organization record
    // and add it as a data context to the tabs
    self.autorun(() => {
        let entity = { ...Template.currentData().item.get() };
        const record = entity.DYN.closest;
        delete entity.DYN;
        self.APP.organization.set({ entity: entity, record: record });
        self.APP.tabsBefore.forEach(( it ) => {
            it.paneData = { organization: { entity: entity, record: record }};
        });
    });

    // make sure the AccountsManager is initialized before trying to initialize it
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
    parmsAccountsList(){
        return {
            name: Template.instance().APP.amInstanceName.get(),
            tabsBefore: Template.instance().APP.tabsBefore,
            tabsUpdates: Template.instance().APP.tabsUpdates,
            mdClasses: 'modal-xl'
        };
    },

    // AccountNewButton parameters
    parmsNewAccount(){
        return {
            name: Template.instance().APP.amInstanceName.get(),
            tabsBefore: Template.instance().APP.tabsBefore,
            tabsUpdates: Template.instance().APP.tabsUpdates,
            shape: PlusButton.C.Shape.RECTANGLE,
            label: pwixI18n.label( I18N, 'identities.new.button_label' ),
            title: pwixI18n.label( I18N, 'identities.new.button_title' ),
            mdClasses: 'modal-xl'
        }
    }
});
