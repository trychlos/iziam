/*
 * /imports/collections/clients_records/collection.js
 */

import { Mongo } from 'meteor/mongo';

export const ClientsRecords = new Mongo.Collection( 'clients_r' );
