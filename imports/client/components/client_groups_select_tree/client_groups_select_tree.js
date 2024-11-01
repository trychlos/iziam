/*
 * /imports/client/components/client_groups_select_tree/client_groups_select_tree.js
 *
 * Select zero to n groups in the hierarchic tree.
 * note that groups are attached at the client entity level, NOT to the client record.
 * 
 * Parms:
 * - entity: a ReactiveVar which holds the client entity to edit (may be empty, but not null) and its DYN sub-objects
 * - index: the index of the edited record
 * - checker: a ReactiveVar which holds the parent Checker
 * - organization: the Organization as an entity with its DYN.records array
 * 
 * Events:
 * - groups-selected: the newly selected groups items, re-triggered each time the selection changes, with data:
 *   > selected: an array of selected ids
 *   > items: an array of selected groups
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { ClientGroupType } from '/imports/common/definitions/client-group-type.def.js';

import './client_groups_select_tree.html';

Template.client_groups_select_tree.onCreated( function(){
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

Template.client_groups_select_tree.helpers({
    // parms for the groups_tree component
    parmsTree(){
        return {
            groups: Template.instance().APP.organization.get().DYN.clients_groups.get(),
            groupTypeDef: ClientGroupType,
            editable: false,
            withClients: false,
            checked: this.entity.get().DYN.memberOf?.direct || []
        };
    }
});

Template.client_groups_select_tree.events({
    // functions advertising
    'tree-fns .c-client-groups-select-tree'( event, instance, data ){
        instance.APP.fnGet = data.fnGet;
    },

    // the user has checked/unchecked a group
    'tree-check .c-client-groups-select-tree'( event, instance ){
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
            let entity = this.entity.get()
            entity.DYN.memberOf = { all: all, direct: direct };
            // no need of reactivity at the time
            //this.item.set( item );
        }
    }
});
