/*
 * /imports/client/components/identity_notes_pane/identity_notes_pane.js
 *
 * Identity notes pane.
 * 
 * Parms:
 * - item: a ReactiveVar which holds the identity object to edit (may be empty, but not null)
 * - checker: a ReactiveVar which holds the parent Checker
 * - amInstance: a ReactiveVar which holds the amClass instance
 * - organization: the Organization as an entity with its DYN.records array
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import './identity_notes_pane.html';

Template.identity_notes_pane.helpers({
    // the NotesEdit data context
    parmsNotes( it ){
        return {
            item: this.item.get(),
            field: this.amInstance.get().fieldSet().byName( 'notes' )
        };
    }
});
