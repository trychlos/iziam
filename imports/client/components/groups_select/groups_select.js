/*
 * /imports/client/components/groups_select/groups_select.js
 *
 * Select zero to n groups in the hierarchic tree.
 * 
 * Parms:
 * - item: a ReactiveVar which holds the identity object to edit (may be empty, but not null)
 * - checker: a ReactiveVar which holds the parent Checker
 * - amInstance: a ReactiveVar which holds the amClass instance
 * - organization: an { entity , record } organization object
 * 
 * Events:
 * - groups-selected: the new selected groups items, re-triggered each time the selection changes
 * - groups-validated: if run inside a dialog, the new selected groups items, when the dialog is validated
 *   these two events hold a data as:
 *   > selected: an array of selected ids
 *   > items: an array of selected groups
 */

import _ from 'lodash';

import './groups_select.html';

Template.groups_select.onCreated( function(){
    const self = this;
    console.debug( this );
    
    self.APP = {
        groups: new ReactiveVar( [] )
    };

    self.autorun(() => {
        const item = Template.currentData().organization;
        const organization = TenantsManager.list.byEntity( item.entity._id );
        if( organization ){
            self.APP.groups.set( organization.DYN.groups.get());
        }
    });
});

Template.groups_select.helpers({
    // parms for the groups_tree component
    parmsTree(){
        return {
            groups: Template.instance().APP.groups,
            editable: false,
            withCheckboxes: true,
            withIdentities: false,
            selected: this.item.get().DYN.memberOf
        };
    }
});
