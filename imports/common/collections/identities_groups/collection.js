/*
 * /imports/common/collections/identities_groups/collection.js
 */

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
        return 'groups_'+organizationId;
    },
    isGroups( name ){
        return name.startsWith( 'groups_' );
    },
    scope( name ){
        return name.replace( /^groups_/, '' );
    },
    fieldSet: new ReactiveVar( null )
};
