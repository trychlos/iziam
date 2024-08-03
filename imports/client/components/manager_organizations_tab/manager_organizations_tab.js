/*
 * /imports/client/components/manager_organizations_tab/manager_organizations_tab.js
 *
 * Organizations management.
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import '../organization_providers_pane/organization_providers_pane.js';
import '../organization_urls_pane/organization_urls_pane.js';

import './manager_organizations_tab.html';

Template.manager_organizations_tab.onCreated( function(){
    const self = this;

    self.APP = {
        tabs: [
            {
                tabid: 'app_organization_providers_tab',
                paneid: 'app_organization_providers_pane',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.providers_tab_title' ),
                paneTemplate: 'organization_providers_pane'
            },
            {
                tabid: 'app_organization_urls_tab',
                paneid: 'app_organization_urls_pane',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.urls_tab_title' ),
                paneTemplate: 'organization_urls_pane'
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
            tabs: Template.instance().APP.tabs,
            shape: PlusButton.C.Shape.RECTANGLE
        }
    },

    // TenantsList parameters
    parmsTenantsList(){
        return {
            tabs: Template.instance().APP.tabs
        }
    }
});
