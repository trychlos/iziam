/*
 * /imports/common/collections/statistics/schema.js
 *
 * Statistics from the REST API.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import SimpleSchema from 'meteor/aldeed:simple-schema';
import { Tracker } from 'meteor/tracker';

import { Statistics } from './index.js';

Tracker.autorun(() => {
    const fieldSet = Statistics.fieldSet?.get();
    if( fieldSet && !Statistics.schemaAttached ){
        Statistics.collection.attachSchema( new SimpleSchema( fieldSet.toSchema()), { replace: true });
        Statistics.collection.attachBehaviour( 'timestampable', { replace: true });
        Statistics.schemaAttached = true;
    }
});
