/*
 * /imports/client/components/client_status_pane/client_status_pane.js
 *
 * Parms:
 * - item: a ReactiveVar which contains the Client, with its DYN.records array of ReactiveVar's
 * - checker: a ReactiveVar which contains the parent checker
 * - organization: the Organization as an entity with its DYN.records array
 */

import '/imports/client/components/operational_panel/operational_panel.js';

import './client_status_pane.html';

Template.client_status_pane.helpers({
    // parms for the operational panel
    parmsOperationalPanel(){
        return {
            entity: this.item.get()._id,
            organization: this.organization
        };
    }
});
