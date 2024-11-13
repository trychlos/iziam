/*
 * /imports/common/collections/clients_entities/schema.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import SimpleSchema from 'meteor/aldeed:simple-schema';
import { Tracker } from 'meteor/tracker';

import { ClientsRecords } from './index.js';

Tracker.autorun(() => {
    const fieldSet = ClientsRecords.fieldSet?.get();
    if( fieldSet ){
        console.debug( 'ClientsRecords attaching schema' );
        ClientsRecords.collection.attachSchema( new SimpleSchema( fieldSet.toSchema()), { replace: true });
        console.debug( 'ClientsRecords schema attached' );
        ClientsRecords.collection.attachBehaviour( 'timestampable', { replace: true });
    }
});
