/*
 * /imports/client/components/identity_authenticate_pane/identity_authenticate_pane.js
 *
 * Parms:
 * - item: a ReactiveVar which holds the identity object to edit (may be empty, but not null)
 * - checker: a ReactiveVar which holds the parent Checker
 * - amInstance: a ReactiveVar which holds the amClass instance
 * - organization: the Organization as an entity with its DYN.records array
 */

import _ from 'lodash';

import '/imports/client/components/identity_password_pane/identity_password_pane.js';

import './identity_authenticate_pane.html';

Template.identity_authenticate_pane.helpers({
    // parms for the authentication pane
    parmsTabbed(){
        const paneData = { ...this };
        return {
            tabs: [
                {
                    navLabel: pwixI18n.label( I18N, 'identities.edit.password_tab_title' ),
                    paneTemplate: 'identity_password_pane',
                    paneData: paneData
                }
            ],
            name: 'identity_password_tab'
        };
    }
});
