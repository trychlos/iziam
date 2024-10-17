/*
 * /imports/client/components/groups_select_box/groups_select_box.js
 *
 * Acts as a standard select box, letting the user select a single group.
 * 
 * Parms:
 * - item: a ReactiveVar which holds the identity object to edit (may be empty, but not null)
 * - checker: a ReactiveVar which holds the parent Checker
 * - organization: the Organization as an entity with its DYN.records array
 * 
 * Events:
 * - groups-selected: the selected group, re-triggered each time the selection changes, with data:
 *   > selected: the selected group
 */

import _ from 'lodash';

import './groups_select_box.html';

Template.groups_select_box.onCreated( function(){
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

Template.groups_select_box.helpers({
    // parms for the groups_tree component
    parmsTree(){
        console.debug( 'groups', Template.instance().APP.organization.get().DYN.groups.get());
        return {
            groups: Template.instance().APP.organization.get().DYN.groups.get(),
            editable: false,
            withIdentities: false,
            selected: this.item.get().DYN?.memberOf?.direct || []
        };
    }
});

Template.groups_select_box.events({
    // functions advertising
    'tree-fns .c-groups-select'( event, instance, data ){
        instance.APP.fnGet = data.fnGet;
    },

    // the user has checked/unchecked a group
    'tree-check .c-groups-select'( event, instance ){
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
