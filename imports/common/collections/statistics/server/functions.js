/*
 * /imports/collections/statistics/server/functions.js
 *
 * Statistics from the REST API.
 */

import { Statistics } from '../index.js';

Statistics.s = {
    async record( o, opts={} ){
        const res = await Statistics.collection.upsertAsync({ _id: null }, { $set: o });
        return res;
    }
};
