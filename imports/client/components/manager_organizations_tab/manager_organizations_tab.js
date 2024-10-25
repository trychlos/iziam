/*
 * /imports/client/components/manager_organizations_tab/manager_organizations_tab.js
 *
 * Organizations management.
 */

import { PlusButton } from 'meteor/pwix:plus-button';
import { pwixI18n } from 'meteor/pwix:i18n';

import '/imports/client/components/authorizations_count_badge/authorizations_count_badge.js';
import '/imports/client/components/clients_count_badge/clients_count_badge.js';
import '/imports/client/components/clients_groups_count_badge/clients_groups_count_badge.js';
import '/imports/client/components/identities_count_badge/identities_count_badge.js';
import '/imports/client/components/identities_groups_count_badge/identities_groups_count_badge.js';
import '/imports/client/components/organization_authorizations_load/organization_authorizations_load.js';
import '/imports/client/components/organization_authorizations_pane/organization_authorizations_pane.js';
import '/imports/client/components/organization_clients_load/organization_clients_load.js';
import '/imports/client/components/organization_clients_pane/organization_clients_pane.js';
import '/imports/client/components/organization_config_dynregistration_pane/organization_config_dynregistration_pane.js';
import '/imports/client/components/organization_config_ident_pane/organization_config_ident_pane.js';
import '/imports/client/components/organization_config_oauth_pane/organization_config_oauth_pane.js';
import '/imports/client/components/organization_config_pane/organization_config_pane.js';
import '/imports/client/components/organization_config_rest_pane/organization_config_rest_pane.js';
import '/imports/client/components/organization_endpoints_pane/organization_endpoints_pane.js';
import '/imports/client/components/organization_identities_groups_load/organization_identities_groups_load.js';
import '/imports/client/components/organization_identities_groups_pane/organization_identities_groups_pane.js';
import '/imports/client/components/organization_identities_load/organization_identities_load.js';
import '/imports/client/components/organization_identities_pane/organization_identities_pane.js';
import '/imports/client/components/organization_jwks_pane/organization_jwks_pane.js';
import '/imports/client/components/organization_keygrips_pane/organization_keygrips_pane.js';
import '/imports/client/components/organization_mandatory_pane/organization_mandatory_pane.js';
import '/imports/client/components/organization_providers_pane/organization_providers_pane.js';
import '/imports/client/components/organization_resources_load/organization_resources_load.js';
import '/imports/client/components/organization_resources_pane/organization_resources_pane.js';
import '/imports/client/components/organization_status_pane/organization_status_pane.js';
import '/imports/client/components/resources_count_badge/resources_count_badge.js';

import './manager_organizations_tab.html';

Template.manager_organizations_tab.onCreated( function(){
    const self = this;

    self.APP = {
        entityTabsNew: [
            {
                name: 'organization_identities_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.identities_tab_title' ),
                enabled: false
            },
            {
                name: 'organization_identities_groups_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.identities_groups_tab_title' ),
                enabled: false
            },
            {
                name: 'organization_clients_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.clients_tab_title' ),
                enabled: false
            },
            {
                name: 'organization_clients_groups_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.clients_groups_tab_title' ),
                enabled: false
            },
            {
                name: 'organization_resources_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.resources_tab_title' ),
                enabled: false
            },
            {
                name: 'organization_authorizations_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.authorizations_tab_title' ),
                enabled: false
            }
        ],
        entityTabsAfterNew: [
            {
                name: 'organization_status_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.status_tab_title' ),
                enabled: false
            }
        ],
        entityTabsEdit: [
            {
                name: 'organization_identities_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.identities_tab_title' ),
                navTemplate: 'identities_count_badge',
                paneTemplate: 'organization_identities_pane'
            },
            {
                name: 'organization_identities_groups_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.identities_groups_tab_title' ),
                navTemplate: 'identities_groups_count_badge',
                paneTemplate: 'organization_identities_groups_pane'
            },
            {
                name: 'organization_clients_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.clients_tab_title' ),
                navTemplate: 'clients_count_badge',
                paneTemplate: 'organization_clients_pane'
            },
            {
                name: 'organization_clients_groups_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.clients_groups_tab_title' ),
                navTemplate: 'clients_groups_count_badge',
                paneTemplate: 'organization_clients_groups_pane'
            },
            {
                name: 'organization_resources_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.resources_tab_title' ),
                navTemplate: 'resources_count_badge',
                paneTemplate: 'organization_resources_pane'
            },
            {
                name: 'organization_authorizations_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.authorizations_tab_title' ),
                navTemplate: 'authorizations_count_badge',
                paneTemplate: 'organization_authorizations_pane'
            }
        ],
        entityTabsAfterEdit: [
            {
                name: 'organization_status_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.status_tab_title' ),
                paneTemplate: 'organization_status_pane'
            },
            // some components which will not be shown, but are just here to load relative data
            {
                paneTemplate: 'organization_authorizations_load',
                shown: false
            },
            {
                paneTemplate: 'organization_clients_load',
                shown: false
            },
            {
                paneTemplate: 'organization_identities_groups_load',
                shown: false
            },
            {
                paneTemplate: 'organization_identities_load',
                shown: false
            },
            {
                paneTemplate: 'organization_resources_load',
                shown: false
            }
        ],
        recordTabsBefore: [
            {
                name: 'organization_mandatory_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.mandatory_tab_title' ),
                paneTemplate: 'organization_mandatory_pane'
            }
        ],
        recordTabs: [
            {
                name: 'organization_config_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.config_tab_title' ),
                paneTemplate: 'organization_config_pane'
            },
            {
                name: 'organization_endpoints_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.endpoints_tab_title' ),
                paneTemplate: 'organization_endpoints_pane'
            },
            {
                name: 'organization_providers_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.providers_tab_title' ),
                paneTemplate: 'organization_providers_pane'
            },
            {
                name: 'organization_jwks_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.jwks.tab_title' ),
                paneTemplate: 'organization_jwks_pane'
            },
            {
                name: 'organization_keygrips_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.keygrips.tab_title' ),
                paneTemplate: 'organization_keygrips_pane'
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
    // disable the clients and accounts tabs for new tenant
    parmsNewTenant(){
        return {
            entityTabs: Template.instance().APP.entityTabsNew,
            entityTabsAfter: Template.instance().APP.entityTabsAfterNew,
            recordTabsBefore: Template.instance().APP.recordTabsBefore,
            recordTabs: Template.instance().APP.recordTabs,
            shape: PlusButton.C.Shape.RECTANGLE,
            mdClasses: 'modal-xxl'
        }
    },

    // TenantsList parameters
    parmsTenantsList(){
        return {
            entityTabs: Template.instance().APP.entityTabsEdit,
            entityTabsAfter: Template.instance().APP.entityTabsAfterEdit,
            recordTabsBefore: Template.instance().APP.recordTabsBefore,
            recordTabs: Template.instance().APP.recordTabs,
            mdClasses: 'modal-xxl'
        }
    }
});
