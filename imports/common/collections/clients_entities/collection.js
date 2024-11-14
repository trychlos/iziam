/*
 * /imports/common/collections/clients_entities/collection.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Mongo } from 'meteor/mongo';
import { ReactiveVar } from 'meteor/reactive-var';

export const ClientsEntities = {
    collection: new Mongo.Collection( 'clients_e' ),
    fieldSet: new ReactiveVar( null ),
    schemaAttached: false
};
