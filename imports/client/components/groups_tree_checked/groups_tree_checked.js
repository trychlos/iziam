/*
 * /imports/client/components/groups_tree_checked/groups_tree_checked.js
 *
 * Select zero to n groups in the groups tree hierarchy.
 * Buttons are not displayed.
 * 
 * Parms:
 * - treeName: an optional name to be displayed in debug messages
 * - groupsRv: a ReactiveVar which contains the groups of the organization
 * - groupsDef: the definition of the target groups type
 * - memberOf: the { all, direct } object to be updated
 * 
 * Events:
 * - groups-checked: to advertise of an update of the passed-in memberOf object
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import './groups_tree_checked.html';

Template.groups_tree_checked.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        // a function to get the tree content
        fnGet: null
    };
});

Template.groups_tree_checked.helpers({
    // parms for the groups_tree component
    parmsTree(){
        return {
            ...this,
            checked: this.memberOf.direct,
            editable: false
        };
    }
});

Template.groups_tree_checked.events({
    // functions advertising
    'tree-fns .c-groups-tree-checked'( event, instance, data ){
        instance.APP.fnGet = data.fnGet;
    },

    // the user has checked/unchecked a group
    'tree-check .c-groups-tree-checked'( event, instance ){
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
            this.memberOf = { all: all, direct: direct };
            instance.$( '.c-groups-tree-checked' ).trigger( 'groups-checked', { memberOf: this.memberOf });
        }
    }
});
