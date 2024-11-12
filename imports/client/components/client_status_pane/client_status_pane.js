/*
 * /imports/client/components/client_status_pane/client_status_pane.js
 *
 * Parms:
 * - entity: a ReactiveVar which contains the client as an entity with its DYN.records array of ReactiveVar's
 * - checker: a ReactiveVar which contains the parent checker
 * - organization: the Organization as an entity with its DYN.records array
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Validity } from 'meteor/pwix:validity';

import '/imports/client/components/operational_panel/operational_panel.js';

import './client_status_pane.html';

Template.client_status_pane.helpers({
    // parms for the operational panel
    parmsOperationalPanel(){
        return {
            entityId: this.entity.get()._id,
            organization: Validity.getEntityRecord( this.organization )
        };
    }
});
