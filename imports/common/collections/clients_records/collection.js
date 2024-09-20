/*
 * /imports/common/collections/clients_records/collection.js
 */

import { Mongo } from 'meteor/mongo';
import { ReactiveVar } from 'meteor/reactive-var';

export const ClientsRecords = {
    collectionName: 'clients_r',
    collection: null,
    fieldSet: new ReactiveVar( null )
};

ClientsRecords.collection = new Mongo.Collection( ClientsRecords.collectionName );

// we need the collection name both here to name the collection, and when publishing to tabular...
