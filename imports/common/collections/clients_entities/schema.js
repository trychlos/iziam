/*
 * /imports/common/collections/clients_entities/schema.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import SimpleSchema from 'meteor/aldeed:simple-schema';
import { Tracker } from 'meteor/tracker';

import 'meteor/aldeed:collection2/static';

import { ClientsEntities } from './index.js';

Tracker.autorun(() => {
    const fieldSet = ClientsEntities.fieldSet?.get();
    if( fieldSet ){
        console.debug( 'ClientsEntities attaching schema' );
        ClientsEntities.collection.attachSchema( new SimpleSchema( fieldSet.toSchema()), { replace: true });
        console.debug( 'ClientsEntities schema attached' );
        ClientsEntities.collection.attachBehaviour( 'timestampable', { replace: true });
    }
});
