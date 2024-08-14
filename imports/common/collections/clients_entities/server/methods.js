/*
 * /imports/collections/clients_entities/server/methods.js
 */

import { ClientsEntities } from '../index.js';

Meteor.methods({
    async 'clients_entities_getBy'( selector ){
        return await ClientsEntities.server.getBy( selector, this.userId );
    }
});
