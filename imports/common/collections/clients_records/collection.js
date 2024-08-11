/*
 * /imports/collections/clients_records/collection.js
 */

import { Mongo } from 'meteor/mongo';
import { ReactiveVar } from 'meteor/reactive-var';

export const ClientsRecords = {
    collection: new Mongo.Collection( 'clients_r' ),
    fieldSet: new ReactiveVar( null )
};
