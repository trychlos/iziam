/*
 * /imports/common/collections/statistics/collection.js
 *
 * Statistics from the REST API.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Mongo } from 'meteor/mongo';
import { ReactiveVar } from 'meteor/reactive-var';

export const Statistics = {
    collectionName: 'statistics',
    collection: null,
    fieldSet: new ReactiveVar( null ),
    schemaAttached: false
};

Statistics.collection = new Mongo.Collection( Statistics.collectionName );

// we need the collection name both here to name the collection, and when publishing to tabular...
