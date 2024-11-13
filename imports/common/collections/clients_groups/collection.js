/*
 * /imports/common/collections/clients_groups/collection.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Mongo } from 'meteor/mongo';
import { ReactiveVar } from 'meteor/reactive-var';
import SimpleSchema from 'meteor/aldeed:simple-schema';
import { Tracker } from 'meteor/tracker';

export const ClientsGroups = {
    collections: {},
    collection( organizationId ){
        if( !ClientsGroups.collections[organizationId] ){
            const c = new Mongo.Collection( ClientsGroups.collectionName( organizationId ));
            if( Meteor.isServer ){
                c.deny({
                    insert(){ return true; },
                    update(){ return true; },
                    remove(){ return true; },
                });
            }
            Tracker.autorun(() => {
                const fieldSet = ClientsGroups.fieldSet.get();
                if( fieldSet ){
                    console.debug( 'ClientsGroups attaching schema' );
                    c.attachSchema( new SimpleSchema( fieldSet.toSchema()), { replace: true });
                    console.debug( 'ClientsGroups schema attached' );
                    c.attachBehaviour( 'timestampable' );
                }
            });
            ClientsGroups.collections[organizationId] = c;
        }
        return ClientsGroups.collections[organizationId];
    },
    collectionName( organizationId ){
        return 'clients_groups_'+organizationId;
    },
    isGroups( name ){
        return name.startsWith( 'clients_groups_' );
    },
    scope( name ){
        return name.replace( /^clients_groups_/, '' );
    },
    fieldSet: new ReactiveVar( null )
};
