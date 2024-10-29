/*
 * /imports/client/components/client_identities_access_pane/client_identities_access_pane.js
 *
 * A panel which let the client defines:
 * - whether it wants authenticated identities
 * - how it manages new identities
 * 
 * This pane is written to be usable:
 * - either inside of the client-new-assistant
 * - or inside the client-edit.
 * 
 * Parms:
 * - entity: the currently edited client entity as a ReactiveVar
 * - index: the index of the edited record
 * - checker: the Forms.Checker which manages the parent component as a ReactiveVar
 * - organization: the Organization as an entity with its DYN.records array
 */

import _ from 'lodash';

import '/imports/client/components/client_identity_access_mode_panel/client_identity_access_mode_panel.js';

import './client_identities_access_pane.html';

Template.client_identities_access_pane.helpers({
    // parms for client_identity_access_mode panel
    parmsAccessMode(){
        return this;
    }
});
