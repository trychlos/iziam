/*
 * /imports/common/collections/clients_entities/schema.js
 */

import SimpleSchema from 'meteor/aldeed:simple-schema';
import { Tracker } from 'meteor/tracker';

import { ClientsEntities } from './index.js';

Tracker.autorun(() => {
    const fieldSet = ClientsEntities.fieldSet?.get();
    if( fieldSet ){
        ClientsEntities.collection.attachSchema( new SimpleSchema( fieldSet.toSchema()), { replace: true });
        ClientsEntities.collection.attachBehaviour( 'timestampable', { replace: true });
    }
});
