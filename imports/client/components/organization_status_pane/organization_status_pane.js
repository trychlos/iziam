/*
 * /imports/client/components/organization_status_pane/organization_status_pane.js
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization, with its DYN.records array of ReactiveVar's
 * - checker: a ReactiveVar which contains the parent checker
 */

import { Forms } from 'meteor/pwix:forms';

import '/imports/client/components/operational_panel/operational_panel.js';

import './organization_status_pane.html';

Template.organization_status_pane.onRendered( function(){
    const self = this;
    //console.debug( this );

    // enable/disable the tab depending of the organization status
    self.autorun(() => {
        const item = Template.currentData().item.get();
        const organization = Meteor.APP.Organizations.byEntity( item._id );
        if( organization ){
            const status = organization.DYN.operational?.status;
            self.$( '.c-organization-status-pane' ).trigger( 'tabbed-do-enable', {
                tabbedId: Template.currentData().tabbedId,
                name: 'organization_status_tab',
                enabled: status !== Forms.CheckStatus.C.VALID
            });
        }
    });
});

Template.organization_status_pane.helpers({
    // parms for the operational panel
    parmsOperationalPanel(){
        return {
            entity: this.item.get()._id
        };
    }
});
