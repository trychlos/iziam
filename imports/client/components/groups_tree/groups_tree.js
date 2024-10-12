/*
 * /imports/group/components/groups_tree/groups_tree.js
 *
 * Let the organization manager edit groups.
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - plus all plusButton parameters will be passed through
 */

import { ReactiveVar } from 'meteor/reactive-var';
import { TenantsManager } from 'meteor/pwix:tenants-manager';

import '/imports/client/components/groups_tree_buttons/groups_tree_buttons.js';
import '/imports/client/components/groups_tree_panel/groups_tree_panel.js';

import './groups_tree.html';

Template.groups_tree.onCreated( function(){
    const self = this;
    
    self.APP = {
        groups: new ReactiveVar( [] )
    };

    self.autorun(() => {
        const item = Template.currentData().item.get();
        const organization = TenantsManager.list.byEntity( item._id );
        if( organization ){
            self.APP.groups.set( organization.DYN.groups.get());
        }
    });
});

Template.groups_tree.helpers({
    parmsTreeButtons(){
        return {
            ...this,
            groups: Template.instance().APP.groups.get()
        };
    },
    parmsTreePanel(){
        return {
            ...this,
            groups: Template.instance().APP.groups.get()
        };
    }
});
