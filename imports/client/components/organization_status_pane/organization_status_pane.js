/*
 * /imports/client/components/organization_status_pane/organization_status_pane.js
 *
 * A pane included in the TenantEditPanel tabbed dialog, so should exhibit the current messages stack.
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization, with its DYN.records array of ReactiveVar's
 * - checker: a ReactiveVar which contains the parent checker
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import '/imports/client/components/operational_panel/operational_panel.js';

import './organization_status_pane.html';

Template.organization_status_pane.helpers({
    // parms for the operational panel
    parmsOperationalPanel(){
        return {
            entityId: this.item.get()._id
        };
    }
});
