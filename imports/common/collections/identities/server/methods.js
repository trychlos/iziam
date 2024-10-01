/*
 * /imports/common/collections/identities/server/methods.js
 */

import { Identities } from '../index.js';

Meteor.methods({
    // retrieve all queried records for the identity
    //  always returns an array, may be empty
    'identity.getBy'( query ){
        return Identities.s.getBy( query );
    },

    // empty the collection before importing
    'identities.empty'(){
        return Identities.remove({});
    },

    // import an element from a JSON file
    'identities.import'( elt ){
        return Identities.insert( elt );
    },

    // delete an item
    'identity.removeById'( id ){
        return Identities.s.removeById( id, this.userId );
    },

    // insert/update an identity in the database
    'identity.upsert'( item, args ){
        return Identities.s.upsert( item, args, this.userId );
    }
});
