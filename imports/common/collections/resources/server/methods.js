/*
 * /imports/common/collections/resources/server/methods.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Resources } from '../index.js';

Meteor.methods({
    // retrieve all queried records for the resources
    //  always returns an array, may be empty
    'resources.getBy'( organizationId, query ){
        return Resources.s.getBy( organizationId, query, this.userId );
    },

    // delete a resource
    'resources.removeById'( organizationId, itemId ){
        return Resources.s.removeById( organizationId, itemId, this.userId );
    },

    // upsert an item
    'resources.upsert'( organizationId, item ){
        return Resources.s.upsert( organizationId, item, this.userId );
    }
});
