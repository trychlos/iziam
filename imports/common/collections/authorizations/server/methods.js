/*
 * /imports/common/collections/authorizations/server/methods.js
 */

import { Authorizations } from '../index.js';

Meteor.methods({
    /*
    // retrieve all queried records for the group
    //  always returns an array, may be empty
    'authorizations.getBy'( query ){
        return Authorizations.s.getBy( query );
    },

    // empty the collection before importing
    'authorizations.empty'(){
        return Authorizations.remove({});
    },

    // import an element from a JSON file
    'authorizations.import'( elt ){
        return Authorizations.insert( elt );
    },


    // upsert an item
    'authorizations.upsert'( elt ){
        return Authorizations.s.upsert({ _id: id });
    }
        */
    // delete an item
    'authorizations.removeById'( id ){
        return Authorizations.s.removeById({ _id: id });
    },
});
