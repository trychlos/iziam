/*
 * /imports/common/collections/authorizations/server/methods.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

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
        */

    // upsert an item
    async 'authorizations.upsert'( organizationId, item ){
        return await Authorizations.s.upsert( organizationId, item, this.userId );
    },

    // delete an item
    async 'authorizations.removeById'( organizationId, itemId ){
        return await Authorizations.s.removeById( organizationId, itemId, this.userId );
    },
});
