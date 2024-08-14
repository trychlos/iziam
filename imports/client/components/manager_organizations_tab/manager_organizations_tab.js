/*
 * /imports/client/components/manager_organizations_tab/manager_organizations_tab.js
 *
 * Organizations management.
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import '../organization_clients_pane/organization_clients_pane.js';
import '../organization_providers_pane/organization_providers_pane.js';
import '../organization_urls_pane/organization_urls_pane.js';

import './manager_organizations_tab.html';

Template.manager_organizations_tab.onCreated( function(){
    const self = this;

    self.APP = {
        entityTabs: [
            {
                tabid: 'app_organization_clients_tab',
                paneid: 'app_organization_clients_pane',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.clients_tab_title' ),
                paneTemplate: 'organization_clients_pane'
            },
        ],
        recordTabs: [
            {
                tabid: 'app_organization_urls_tab',
                paneid: 'app_organization_urls_pane',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.urls_tab_title' ),
                paneTemplate: 'organization_urls_pane'
            },
            {
                tabid: 'app_organization_providers_tab',
                paneid: 'app_organization_providers_pane',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.providers_tab_title' ),
                paneTemplate: 'organization_providers_pane'
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
    parmsNewTenant(){
        return {
            entityTabs: Template.instance().APP.entityTabs,
            recordTabs: Template.instance().APP.recordTabs,
            shape: PlusButton.C.Shape.RECTANGLE
        }
    },

    // TenantsList parameters
    parmsTenantsList(){
        return {
            entityTabs: Template.instance().APP.entityTabs,
            recordTabs: Template.instance().APP.recordTabs
        }
    }
});
