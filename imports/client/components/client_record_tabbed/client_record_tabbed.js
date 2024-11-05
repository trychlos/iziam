/*
 * /imports/client/components/client_record_tabbed/client_record_tabbed.js
 *
 * We have one client_record_tabbed component per currently edited validity period,
 *  and, as a matter of fact, there is a 1-to-1 relation between client_record_tabbed and the corresponding tab inside of validities_tabbed
 * Gathers here organization_properties_pane, validities_fieldset and notes_panel datas.
 *
 * Parms:
 * - entity: the currently edited entity as a ReactiveVar
 * - index: the index of the edited record
 * - checker: the Forms.Checker which manages the parent component
 * - organization: the Organization as an entity with its DYN.records array
 *
 * Because client_record_tabbed, which hosts client properties as tabs, is itself hosted inside of ValidityTabbed component with one tab per validity period,
 *  we identify each validity period through the tab identifier allocated by the ValidityTabbed (which happens to be the Tabbed parent of this client_record_tabbed).
 * Note too that Validity is able to (is actually built to do that) modify the validity periods. This implies that this client_record_tabbed may be changed,
 * or even dynamically removed. But due to Blaze latencies and asynchronicities, we may receive here updates for a to-be-destroyed view. So care of that.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import { ClientsRecords } from '/imports/common/collections/clients_records/index.js';

import './client_record_tabbed.html';

Template.client_record_tabbed.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        fields: {
            effectStart: {
                js: '.js-start input',
            },
            effectEnd: {
                js: '.js-end input',
            }
        },
        // the Checker instance
        checker: new ReactiveVar( null ),
        // the Tabbed parameters
        tabs: new ReactiveVar( null ),
        // the ValidityFieldset parameters
        parmsValidity: new ReactiveVar( null )
    };

    // define the tabs
    //  we should be reactive to data context changes only as the tabs population is fixed
    const dataContext = Template.currentData();
    if( dataContext.index >= dataContext.entity.get().DYN.records.length ){
        dataContext.index = dataContext.entity.get().DYN.records.length - 1;
    }
    const notes = ClientsRecords.fieldSet.get().byName( 'notes' );
    const paneData = {
        entity: dataContext.entity,
        index: dataContext.index,
        checker: dataContext.checker,
        organization: dataContext.organization
    };
    self.APP.tabs.set([
        {
            name: 'client_properties_tab',
            navLabel: pwixI18n.label( I18N, 'clients.edit.properties_tab_title' ),
            paneTemplate: 'client_properties_panel',
            paneData: {
                ...paneData,
                withApplicationType: true,
                withEnabled: true,
                withProfile: true,
                withClientType: true
            }
        },
        {
            name: 'client_grant_types_tab',
            navLabel: pwixI18n.label( I18N, 'clients.edit.auth_flow_tab_title' ),
            paneTemplate: 'client_grant_types_panel',
            paneData: paneData
        },
        {
            name: 'client_auth_method_tab',
            navLabel: pwixI18n.label( I18N, 'clients.edit.auth_method_tab_title' ),
            paneTemplate: 'client_auth_method_panel',
            paneData: paneData
        },
        {
            name: 'client_config_tab',
            navLabel: pwixI18n.label( I18N, 'clients.edit.config_tab_title' ),
            paneTemplate: 'client_config_pane',
            paneData: paneData
        },
        {
            name: 'client_redirects_tab',
            navLabel: pwixI18n.label( I18N, 'clients.edit.redirects_tab_title' ),
            paneTemplate: 'client_redirects_panel',
            paneData: {
                ...paneData,
                haveOne: false
            }
        },
        {
            name: 'client_jwks_tab',
            navLabel: pwixI18n.label( I18N, 'clients.edit.jwks_tab_title' ),
            paneTemplate: 'client_jwks_panel',
            paneData: paneData
        },
        {
            name: 'client_secrets_tab',
            navLabel: pwixI18n.label( I18N, 'clients.edit.secrets_tab_title' ),
            paneTemplate: 'client_secrets_panel',
            paneData: paneData
        },
        {
            name: 'client_contacts_tab',
            navLabel: pwixI18n.label( I18N, 'clients.edit.contacts_tab_title' ),
            paneTemplate: 'client_contacts_panel',
            paneData: {
                ...paneData,
                haveOne: false
            }
        },
        {
            name: 'client_notes_tab',
            name: 'record_notes_tab',
            navLabel: pwixI18n.label( I18N, 'clients.edit.record_notes_tab_title' ),
            paneTemplate: 'NotesEdit',
            paneData: {
                item: dataContext.entity.get().DYN.records[dataContext.index].get(),
                field: notes
            }
        }
    ]);

    // prepare the validity fieldset parms
    self.autorun(() => {
        const dataContext = Template.currentData();
        if( dataContext.index < dataContext.entity.get().DYN.records.length ){
            const parms = {
                startDate: dataContext.entity.get().DYN.records[dataContext.index].get().effectStart,
                endDate: dataContext.entity.get().DYN.records[dataContext.index].get().effectEnd
            };
            self.APP.parmsValidity.set( parms );
        } else {
            self.APP.parmsValidity.set( null );
        }
    });
});

Template.client_record_tabbed.onRendered( function(){
    const self = this;

    // initialize the Checker for this panel as soon as we get the parent Checker
    self.autorun(() => {
        const dataContext = Template.currentData();
        if( dataContext.index < dataContext.entity.get().DYN.records.length ){
            const parentChecker = dataContext.checker.get();
            const checker = self.APP.checker.get();
            if( parentChecker && !checker ){
                self.APP.checker.set( new Forms.Checker( self, {
                    parent: parentChecker,
                    panel: new Forms.Panel( self.APP.fields, ClientsRecords.fieldSet.get()),
                    data: {
                        entity: dataContext.entity,
                        index: dataContext.index
                    }
                }));
            }
        } else {
            self.APP.checker.set( null );
        }
    });
});

Template.client_record_tabbed.helpers({
    // data context for Tabbed
    parmsTabbed(){
        return {
            name: 'client_record_tabbed_'+this.index,
            tabs: Template.instance().APP.tabs.get()
        }
    },

    // data context for ValidityFieldset
    parmsValidity(){
        return Template.instance().APP.parmsValidity.get();
    }
});
