/*
 * /imports/common/collections/groups/server/methods.js
 */

import { Groups } from '../index.js';

Meteor.methods({
    // retrieve all queried records for the group
    //  always returns an array, may be empty
    async 'groups.getBy'( query ){
        return await Groups.s.getBy( query );
    },

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

    // insert/update an group in the database
    async 'groups.upsert'( item, groups=[], identities=[] ){
        return await Groups.s.upsert( item, groups, identities, this.userId );
    }
});
