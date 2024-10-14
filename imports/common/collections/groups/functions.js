/*
 * /imports/common/collections/groups/functions.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { Groups } from './index.js';

Groups.fn = {

    /**
     * @param {Object} organization entity with its DYN sub-object
     * @param {Array} groups the list of groups in the organization (may be different of the content of GroupsRegistrar when editing)
     * @param {Object} group the group we search the members of
     * @returns {Array} identities group items, at least an empty array
     */
    getIdentities( organization, groups, group ){
        let identities = [];
        groups.forEach(( it ) => {
            if( it.parent === group._id && it.type === 'I' ){
                identities.push( it );
            }
        });
        return identities;
    },

    /**
     * @summary Transform a tree representing the groups hierarchy to a flat array suitable to be written in database
     *  In the tree, each item may have children
     *  While our flat representation reverse the sens and item smay are attached to a parent
     * @locus Anywhere
     * @param {Array<Group>} tree
     * @param {Object} opts an optional options object with following keys:
     *  - organizationId: the organization identifier
     * @returns {Array<Group>} flat
     */
    tree2flat( organizationId, tree, opts={} ){
        let flat = [];
        const flat_fn = function( it, parent=null ){
            const children = it.children || [];
            delete it.children;
            it.parent = parent;
            it.organization = organizationId;
            flat.push( it );
            children.forEach(( child ) => {
                flat_fn( child, it._id );
            });
        };
        // at the first level, tree nodes have no parent
        tree.forEach(( it ) => {
            flat_fn( it );
        });
        return flat;
    }
};
