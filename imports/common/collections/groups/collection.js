/*
 * /imports/common/collections/groups/collection.js
 */

import { Mongo } from 'meteor/mongo';
import { ReactiveVar } from 'meteor/reactive-var';

export const Groups = {
    collectionName: 'groups',
    collection: null,
    fieldSet: new ReactiveVar( null )
};

Groups.collection = new Mongo.Collection( Groups.collectionName );

// we need the collection name both here to name the collection, and when publishing to tabular...
