/*
 * /imports/client/components/identity_groups_select_tree/identity_groups_select_tree.js
 *
 * Select zero to n groups in the hierarchic tree.
 * 
 * Parms:
 * - item: a ReactiveVar which holds the identity object to edit (may be empty, but not null)
 * - checker: a ReactiveVar which holds the parent Checker
 * - amInstance: a ReactiveVar which holds the amClass instance
 * - organization: the Organization as an entity with its DYN.records array
 * 
 * Events:
 * - groups-selected: the newly selected groups items, re-triggered each time the selection changes, with data:
 *   > selected: an array of selected ids
 *   > items: an array of selected groups
 */

import _ from 'lodash';

import { IdentityGroupType } from '/imports/common/definitions/identity-group-type.def.js';

import './identity_groups_select_tree.html';

Template.identity_groups_select_tree.onCreated( function(){
    const self = this;
    //console.debug( this );
    
    self.APP = {
        // address the *saved* organization entity
        organization: new ReactiveVar( [] ),
        // a function to get the tree content
        fnGet: null
    };

    self.autorun(() => {
        const item = Template.currentData().organization;
        self.APP.organization.set( TenantsManager.list.byEntity( item._id ));
    });
});

Template.identity_groups_select_tree.helpers({
    // parms for the groups_tree component
    parmsTree(){
        //console.debug( 'groups', Template.instance().APP.organization.get().DYN.groups.get());
        return {
            groups: Template.instance().APP.organization.get().DYN.identities_groups.get(),
            groupTypeDef: IdentityGroupType,
            editable: false,
            withIdentities: false,
            checked: this.item.get().DYN?.memberOf?.direct || []
        };
    }
});

Template.identity_groups_select_tree.events({
    // functions advertising
    'tree-fns .c-identity-groups-select-tree'( event, instance, data ){
        instance.APP.fnGet = data.fnGet;
    },

    // the user has checked/unchecked a group
    'tree-check .c-identity-groups-select-tree'( event, instance ){
        if( instance.APP.fnGet ){
            let direct = [];
            let all = [];
            const recfn = function( it ){
                if( it.DYN.checked === true ){
                    all.push( it._id );
                    if( it.DYN.enabled === true ){
                        direct.push( it._id );
                    }
                }
                if( it.children ){
                    it.children.forEach(( child ) => {
                        recfn( child );
                    });
                }
            };
            instance.APP.fnGet().forEach(( it ) => {
                recfn( it );
            });
            let item = this.item.get()
            item.DYN.memberOf = { all: all, direct: direct };
            // no need of reactivity at the time
            //this.item.set( item );
        }
    }
});
