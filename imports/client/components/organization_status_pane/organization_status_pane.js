/*
 * /imports/client/components/organization_status_pane/organization_status_pane.js
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization, with its DYN.records array of ReactiveVar's
 * - checker: a ReactiveVar which contains the parent checker
 */

import '/imports/client/components/operational_panel/operational_panel.js';

import './organization_status_pane.html';

Template.organization_status_pane.helpers({
    // parms for the operational panel
    parmsOperationalPanel(){
        console.debug( this );
        return {
            entity: this.item.get()._id
        };
    }
});
