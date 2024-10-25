/*
 * /imports/common/collections/clients_groups/server/methods.js
 */

import { ClientsGroups } from '../index.js';

Meteor.methods({
    // retrieve all queried records for the group
    //  always returns an array, may be empty
    async 'clients_groups.getBy'( organizationId, query ){
        return await ClientsGroups.s.getBy( organizationId, query, this.userId );
    },

    // insert/update a group in the database
    async 'clients_groups.upsert_item'( organizationId, item ){
        return await ClientsGroups.s.upsert_item( organizationId, item, this.userId );
    },

    // insert/update all the groups tree
    async 'clients_groups.upsert_tree'( organizationId, groups ){
        return await ClientsGroups.s.upsert_tree( organizationId, groups, this.userId );
    }
});
