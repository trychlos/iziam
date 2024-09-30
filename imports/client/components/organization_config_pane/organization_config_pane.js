/*
 * /imports/client/components/organization_config_pane/organization_config_pane.js
 *
 * Parms:
 * - checker: a ReactiveVar which contains the current Forms.Checker
 * - entity: a ReactiveVar which contains the Organization entity
 * - index: the index of the current record
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import './organization_config_pane.html';

Template.organization_config_pane.helpers({
    parmsTabbed(){
        return {
            name: 'organization.config',
            dataContext: this,
            tabs: [
                {
                    name: 'organization_config_rest_tab',
                    navLabel: pwixI18n.label( I18N, 'organizations.edit.rest_config_tab_title' ),
                    paneTemplate: 'organization_config_rest_pane'
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
                }
            ]
        };
    }
});
