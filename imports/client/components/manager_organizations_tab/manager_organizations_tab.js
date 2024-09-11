/*
 * /imports/client/components/manager_organizations_tab/manager_organizations_tab.js
 *
 * Organizations management.
 */

import { PlusButton } from 'meteor/pwix:plus-button';
import { pwixI18n } from 'meteor/pwix:i18n';

import '/imports/client/components/organization_clients_pane/organization_clients_pane.js';
import '/imports/client/components/organization_config_pane/organization_config_pane.js';
import '/imports/client/components/organization_dynregistration_pane/organization_dynregistration_pane.js';
import '/imports/client/components/organization_jwks_pane/organization_jwks_pane.js';
import '/imports/client/components/organization_providers_pane/organization_providers_pane.js';
import '/imports/client/components/organization_urls_pane/organization_urls_pane.js';

import './manager_organizations_tab.html';

Template.manager_organizations_tab.onCreated( function(){
    const self = this;

    self.APP = {
        entityTabsNew: [
            {
                name: 'organization_clients_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.clients_tab_title' ),
                enabled: false
            },
        ],
        entityTabsEdit: [
            {
                name: 'organization_clients_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.clients_tab_title' ),
                paneTemplate: 'organization_clients_pane'
            },
        ],
        recordTabs: [
            {
                name: 'organization_urls_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.urls_tab_title' ),
                paneTemplate: 'organization_urls_pane'
            },
            {
                name: 'organization_providers_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.providers_tab_title' ),
                paneTemplate: 'organization_providers_pane'
            },
            {
                name: 'organization_config_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.config_tab_title' ),
                paneTemplate: 'organization_config_pane'
            },
            {
                name: 'organization_dynregistration_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.dynregistration_tab_title' ),
                paneTemplate: 'organization_dynregistration_pane'
            },
            {
                name: 'organization_jwks_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.jwks.tab_title' ),
                paneTemplate: 'organization_jwks_pane'
            }
        ]
    };
});

Template.manager_organizations_tab.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // TenantNewButton parameters
    // disable the clients tab for new tenant
    parmsNewTenant(){
        return {
            entityTabs: Template.instance().APP.entityTabsNew,
            recordTabs: Template.instance().APP.recordTabs,
            shape: PlusButton.C.Shape.RECTANGLE,
            mdClasses: 'modal-xxl'
        }
    },

    // TenantsList parameters
    parmsTenantsList(){
        return {
            entityTabs: Template.instance().APP.entityTabsEdit,
            recordTabs: Template.instance().APP.recordTabs,
            mdClasses: 'modal-xxl'
        }
    }
});
