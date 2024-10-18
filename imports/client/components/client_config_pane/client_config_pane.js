/*
 * /imports/client/components/client_config_pane/client_config_pane.js
 *
 * Parms:
 * - entity: a ReactiveVar which contains the Organization, with its DYN.records array of ReactiveVar's
 * - index: the index of the currently edited Client record
 * - checker: a ReactiveVar which contains the parent checker
 * - organization: the Organization as an entity with its DYN.records array
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import '/imports/client/components/client_authorizations_panel/client_authorizations_panel.js';
import '/imports/client/components/client_scopes_panel/client_scopes_panel.js';
import '/imports/client/components/client_token_extensions_panel/client_token_extensions_panel.js';

import './client_config_pane.html';

Template.client_config_pane.helpers({
    parmsTabbed(){
        return {
            name: 'client.config',
            dataContext: this,
            tabs: [
                {
                    name: 'client_token_extensions_tab',
                    navLabel: pwixI18n.label( I18N, 'clients.edit.token_extensions_tab_title' ),
                    paneTemplate: 'client_token_extensions_panel'
                },
                {
                    name: 'client_scopes_tab',
                    navLabel: pwixI18n.label( I18N, 'clients.edit.scopes_tab_title' ),
                    paneTemplate: 'client_scopes_panel'
                },
                {
                    name: 'client_authorizations_tab',
                    navLabel: pwixI18n.label( I18N, 'clients.edit.authorizations_tab_title' ),
                    paneTemplate: 'client_authorizations_panel'
                }
            ]
        };
    }
});