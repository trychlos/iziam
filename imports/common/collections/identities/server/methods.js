/*
 * /imports/common/collections/identities/server/methods.js
 */

import { Identities } from '../index.js';

Meteor.methods({
    // retrieve all queried records for the identity
    //  always returns an array, may be empty
    'identities.getBy'( organizationId, query ){
        return Identities.s.getBy( organizationId, query, this.userId );
    },

    // insert/update an identity in the database
    'identity.upsert'( item, args ){
        return Identities.s.upsert( item, args, this.userId );
    }
});
