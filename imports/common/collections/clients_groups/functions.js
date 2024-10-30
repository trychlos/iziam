/*
 * /imports/common/collections/clients_groups/functions.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { ClientsGroups } from './index.js';

ClientsGroups.fn = {

    /**
     * @param {String} organizationId
     * @param {Object|String} group the group identifier or the group object
     * @returns {String} the best label we can get for group
     */
    async bestLabel( organizationId, group ){
        let groupObject = await ClientsGroups.fn.group( organizationId, group );
        const label = groupObject.label || groupObject._id;
        return label;
    },

    /**
     * @summary Extract from the groups definitions the list of clients attached to the specified group
     * @param {String} organizationId
     * @param {Array} groups the list of groups in the organization (may be different of the content of ClientsGroupsRegistrar when editing)
     * @param {Object} group the group we search the members of
     * @returns {Array} clients group items, at least an empty array
     */
    getClients( organizationId, groups, group ){
        let clients = [];
        groups.forEach(( it ) => {
            if( it.parent === group._id && it.type === 'C' ){
                clients.push( it );
            }
        });
        return clients;
    },

    /**
     * @param {String} organizationId
     * @param {Object|String} group the group identifier or the group object
     * @returns {Object} the group object
     */
    async group( organizationId, group ){
        let groupObject = null;
        if( _.isString( group )){
            const array = await(
                Meteor.isClient ?
                    Meteor.callAsync( 'clients_groups.getBy', organizationId, { _id: group }) :
                    ClientsGroups.s.getBy( organizationId, { _id: group }, null, { from: organizationId })
            );
            groupObject = array && array.length && array[0];
        } else {
            groupObject = group;
        }
        return groupObject;
    },

    /**
     * @summary Transform a tree representing the groups hierarchy to a flat array suitable to be written in database
     *  In the tree, each item may have children
     *  While our flat representation reverse the sens and items are attached to a parent
     * @locus Anywhere
     * @param {String} organizationId
     * @param {Array<Group>} tree
     * @returns {Array<Group>} flat
     */
    tree2flat( organizationId, tree ){
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
