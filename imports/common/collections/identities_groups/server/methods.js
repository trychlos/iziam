/*
 * /imports/common/collections/identities_groups/server/methods.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { IdentitiesGroups } from '../index.js';

Meteor.methods({
    // retrieve all queried records for the group
    //  always returns an array, may be empty
    async 'identities_groups.getBy'( organizationId, query ){
        return await IdentitiesGroups.s.getBy( organizationId, query, this.userId );
    },

    // insert/update a group in the database
    async 'identities_groups.upsert_item'( organizationId, item ){
        return await IdentitiesGroups.s.upsert_item( organizationId, item, this.userId );
    },

    // insert/update all the groups tree
    async 'identities_groups.upsert_tree'( organizationId, groups ){
        return await IdentitiesGroups.s.upsert_tree( organizationId, groups, this.userId );
    }
});
