/*
 * /imports/common/collections/groups/server/methods.js
 */

import { Groups } from '../index.js';

Meteor.methods({
    // retrieve all queried records for the group
    //  always returns an array, may be empty
    async 'groups.getBy'( organizationId, query ){
        return await Groups.s.getBy( organizationId, query, this.userId );
    },

    /*
    // empty the collection before importing
    async 'groups.empty'(){
        return await Groups.remove({});
    },

    // import an element from a JSON file
    async 'groups.import'( elt ){
        return await Groups.insert( elt );
    },

    // delete an item
    async 'groups.removeById'( id ){
        return await Groups.s.removeById( id, this.userId );
    },
    */

    // insert/update a group in the database
    async 'groups.upsert_item'( organizationId, item ){
        return await Groups.s.upsert_item( organizationId, item, this.userId );
    },

    // insert/update all the groups tree
    async 'groups.upsert_tree'( organizationId, groups ){
        return await Groups.s.upsert_tree( organizationId, groups, this.userId );
    }
});
