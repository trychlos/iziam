/*
 * /imports/collections/clients_entities/server/methods.js
 */

import { ClientsEntities } from '../index.js';

Meteor.methods({
    // retrieve all queried records for the client
    //  always returns an array, may be empty
    'clients.entities.getBy'( query ){
        return ClientsEntities.s.getBy( query );
    }
});
