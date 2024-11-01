/*
 * /imports/common/collections/statistics/server/functions.js
 *
 * Statistics from the REST API.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Statistics } from '../index.js';

Statistics.s = {
    async record( o, opts={} ){
        const res = await Statistics.collection.upsertAsync({ _id: null }, { $set: o });
        return res;
    }
};
