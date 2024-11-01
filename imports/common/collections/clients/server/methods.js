/*
 * /imports/common/collections/clients/server/methods.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Clients } from '../index.js';

Meteor.methods({

    // delete a client and all its validity records
    //  entity is an object with a DYN.records array of ReactiveVar's
    async 'client.delete'( entityId ){
        return await Clients.s.delete( entityId, this.userId );
    },

    // insert/update an client in the database
    //  entity is an object with a DYN.records array of ReactiveVar's
    async 'client.upsert'( entity ){
        return await Clients.s.upsert( entity, this.userId );
    }
});
