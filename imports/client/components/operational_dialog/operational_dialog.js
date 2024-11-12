/*
 * /imports/client/components/operational_dialog/operational_dialog.js
 *
 * A modal dialog to display entities operational status.
 * 
 * Parms:
 * - entity: a ReactiveVar which contains the Organization, with its DYN.records array of ReactiveVar's
 * - index: the index of the current edited organization record
 * - item: the Keygrip item to be edited here, may be null
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import '/imports/client/components/operational_panel/operational_panel.js';

import './operational_dialog.html';

Template.operational_dialog.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        // whether we are running inside of a Modal
        isModal: new ReactiveVar( false )
    };
});

Template.operational_dialog.onRendered( function(){
    const self = this;
    //console.debug( self );

    // whether we are running inside of a Modal
    self.autorun(() => {
        self.APP.isModal.set( self.$( '.c-operational-dialog' ).parent().hasClass( 'modal-body' ));
    });

    // set the modal target
    self.autorun(() => {
        if( self.APP.isModal.get()){
            Modal.set({
                target: self.$( '.c-operational-dialog' )
            });
        }
    });
});
