/*
 * /imports/client/components/client_config_pane/client_config_pane.js
 *
 * Parms:
 * - entity: a ReactiveVar which contains the Organization, with its DYN.records array of ReactiveVar's
 * - index: the index of the currently edited Client record
 * - checker: a ReactiveVar which contains the parent checker
 * - organization: the Organization as an entity with its DYN.records array
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import '/imports/client/components/client_authorizations_panel/client_authorizations_panel.js';
import '/imports/client/components/client_identities_access_pane/client_identities_access_pane.js';
import '/imports/client/components/client_identities_auth_pane/client_identities_auth_pane.js';
import '/imports/client/components/client_scopes_panel/client_scopes_panel.js';
import '/imports/client/components/client_token_extensions_panel/client_token_extensions_panel.js';

import './client_config_pane.html';

Template.client_config_pane.onCreated( function(){
    const self = this;

    self.APP = {
        // the tabs
        //  define tabs as fixed data so that this same variable can be updated by Tabbed
        tabs: [
            {
                name: 'client_token_extensions_tab',
                navLabel: pwixI18n.label( I18N, 'clients.edit.token_extensions_tab_title' ),
                paneTemplate: 'client_token_extensions_panel'
            },
            {
                name: 'client_identities_auth_tab',
                navLabel: pwixI18n.label( I18N, 'clients.edit.identities_auth_tab_title' ),
                paneTemplate: 'client_identities_auth_pane'
            },
            {
                name: 'client_identities_access_tab',
                navLabel: pwixI18n.label( I18N, 'clients.edit.identities_access_tab_title' ),
                paneTemplate: 'client_identities_access_pane'
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
});

Template.client_config_pane.helpers({
    parmsTabbed(){
        return {
            name: 'client.config_'+this.index,
            dataContext: this,
            tabs: Template.instance().APP.tabs
        };
    }
});
