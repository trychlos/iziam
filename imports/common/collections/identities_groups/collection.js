/*
 * /imports/common/collections/identities_groups/collection.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Mongo } from 'meteor/mongo';
import { ReactiveVar } from 'meteor/reactive-var';
import SimpleSchema from 'meteor/aldeed:simple-schema';
import { Tracker } from 'meteor/tracker';

export const IdentitiesGroups = {
    collections: {},
    collection( organizationId ){
        if( !IdentitiesGroups.collections[organizationId] ){
            const c = new Mongo.Collection( IdentitiesGroups.collectionName( organizationId ));
            if( Meteor.isServer ){
                c.deny({
                    insert(){ return true; },
                    update(){ return true; },
                    remove(){ return true; },
                });
            }
            Tracker.autorun(() => {
                const fieldSet = IdentitiesGroups.fieldSet.get();
                if( fieldSet ){
                    c.attachSchema( new SimpleSchema( fieldSet.toSchema()), { replace: true });
                    c.attachBehaviour( 'timestampable' );
                }
            });
            IdentitiesGroups.collections[organizationId] = c;
        }
        return IdentitiesGroups.collections[organizationId];
    },
    collectionName( organizationId ){
        return 'identities_groups_'+organizationId;
    },
    isGroups( name ){
        return name.startsWith( 'identities_groups_' );
    },
    scope( name ){
        return name.replace( /^identities_groups_/, '' );
    },
    fieldSet: new ReactiveVar( null )
};
