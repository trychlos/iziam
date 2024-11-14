/*
 * /imports/common/collections/clients_entities/schema.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import SimpleSchema from 'meteor/aldeed:simple-schema';
import { Tracker } from 'meteor/tracker';

// for consistency with ClientsEntities
import 'meteor/aldeed:collection2/static';

import { ClientsRecords } from './index.js';

Tracker.autorun(() => {
    const fieldSet = ClientsRecords.fieldSet?.get();
    if( fieldSet && !ClientsRecords.schemaAttached ){
        console.debug( 'ClientsRecords attaching schema' );
        ClientsRecords.collection.attachSchema( new SimpleSchema( fieldSet.toSchema()), { replace: true });
        console.debug( 'ClientsRecords schema attached' );
        ClientsRecords.collection.attachBehaviour( 'timestampable', { replace: true });
        ClientsRecords.schemaAttached = true;
    }
});
