/*
 * /imports/client/components/organization_config_pane/organization_config_pane.js
 *
 * Parms:
 * - checker: a ReactiveVar which contains the current Forms.Checker
 * - entity: a ReactiveVar which contains the Organization entity
 * - index: the index of the current record
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import './organization_config_pane.html';

Template.organization_config_pane.onCreated( function(){
    const self = this;

    self.APP = {
        // the tabs
        // must be defined yhere so that they are fixed data (the Tabbed package will update them, and then retrieve its own data on updates)
        tabs: [
            {
                // the only field of the REST config pane is the baseUrl which is made available in the mandatory pane
                name: 'organization_config_rest_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.rest_config_tab_title' ),
                paneTemplate: 'organization_config_rest_pane',
                shown: false
            },
            {
                name: 'organization_config_oauth_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.oauth_config_tab_title' ),
                paneTemplate: 'organization_config_oauth_pane'
            },
            {
                name: 'organization_config_ident_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.ident_config_tab_title' ),
                paneTemplate: 'organization_config_ident_pane'
            },
            {
                name: 'organization_config_dynregistration_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.dynregistration_tab_title' ),
                paneTemplate: 'organization_config_dynregistration_pane'
            },
            {
                name: 'organization_config_ttls_tab',
                navLabel: pwixI18n.label( I18N, 'organizations.edit.ttls_config_tab_title' ),
                paneTemplate: 'organization_config_ttls_pane'
            }
        ]
    }
});

Template.organization_config_pane.helpers({
    // MUST prevent the tabs to be redefined when only the data context changes
    parmsTabbed(){
        return {
            name: 'organization.config_'+this.index,
            dataContext: this,
            tabs: Template.instance().APP.tabs
        };
    }
});
