/*
 * /imports/common/collections/resources/server/methods.js
 */

import { Resources } from '../index.js';

Meteor.methods({
    // retrieve all queried records for the resources
    //  always returns an array, may be empty
    'resources.getBy'( organizationId, query ){
        return Resources.s.getBy( organizationId, query, this.userId );
    },

    // upsert an item
    'resources.upsert'( organizationId, item ){
        return Resources.s.upsert( organizationId, item, this.userId );
    }

    /*
    // empty the collection before importing
    'authorizations.empty'(){
        return Authorizations.remove({});
    },

    // import an element from a JSON file
    'authorizations.import'( elt ){
        return Authorizations.insert( elt );
    },

    // delete an item
    'authorizations.removeById'( id ){
        return Authorizations.s.removeById({ _id: id });
    },
        */
});
