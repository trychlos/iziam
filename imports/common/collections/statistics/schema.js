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
    if( fieldSet ){
        console.debug( 'Statistics attaching schema' );
        Statistics.collection.attachSchema( new SimpleSchema( fieldSet.toSchema()), { replace: true });
        console.debug( 'Statistics schema attached' );
        Statistics.collection.attachBehaviour( 'timestampable', { replace: true });
    }
});
