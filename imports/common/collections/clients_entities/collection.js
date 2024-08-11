/*
 * /imports/collections/clients_entities/collection.js
 */

import { Mongo } from 'meteor/mongo';
import { ReactiveVar } from 'meteor/reactive-var';

export const ClientsEntities = {
    collection: new Mongo.Collection( 'clients_e' ),
    fieldSet: new ReactiveVar( null )
};
