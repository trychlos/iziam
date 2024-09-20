/*
 * /imports/common/collections/statistics/schema.js
 *
 * Statistics from the REST API.
 */

import SimpleSchema from 'meteor/aldeed:simple-schema';
import { Tracker } from 'meteor/tracker';

import { Statistics } from './index.js';

Tracker.autorun(() => {
    const fieldSet = Statistics.fieldSet?.get();
    if( fieldSet ){
        Statistics.collection.attachSchema( new SimpleSchema( fieldSet.toSchema()), { replace: true });
        Statistics.collection.attachBehaviour( 'timestampable', { replace: true });
    }
});
