/*
 * /imports/client/components/client_status_pane/client_status_pane.js
 *
 * Parms:
 * - item: a ReactiveVar which contains the Client, with its DYN.records array of ReactiveVar's
 * - checker: a ReactiveVar which contains the parent checker
 * - organization: an { entity, record } object
 */

import { Forms } from 'meteor/pwix:forms';

import '/imports/client/components/operational_panel/operational_panel.js';

import './client_status_pane.html';

Template.client_status_pane.onRendered( function(){
    const self = this;
    //console.debug( this );

    // enable/disable the tab depending of the client status
    self.autorun(() => {
        const item = Template.currentData().item.get();
        const client = Meteor.APP.Clients.byId( item._id );
        if( client ){
            const status = client.DYN.operational?.status;
            self.$( '.c-client-status-pane' ).trigger( 'tabbed-do-enable', {
                tabbedId: Template.currentData().tabbedId,
                name: 'client_status_tab',
                enabled: status !== Forms.CheckStatus.C.VALID
            });
        }
    });
});

Template.client_status_pane.helpers({
    // parms for the operational panel
    parmsOperationalPanel(){
        return {
            entity: this.item.get()._id,
            organization: this.organization
        };
    }
});
