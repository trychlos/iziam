/*
 * /imports/collections/clients/collection.js
 *
 * The clients registered with an organization.
 */

import { Mongo } from 'meteor/mongo';

export const Clients = new Mongo.Collection( 'clients' );
