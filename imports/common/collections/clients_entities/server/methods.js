/*
 * /imports/common/collections/clients_entities/server/methods.js
 */

import { ClientsEntities } from '../index.js';

Meteor.methods({
    async 'clients_entities_getBy'( organizationId, selector ){
        return await ClientsEntities.s.getBy( organizationId, selector, this.userId );
    }
});
