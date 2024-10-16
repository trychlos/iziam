/*
 * /imports/common/collections/groups/collection.js
 */

import { Mongo } from 'meteor/mongo';
import { ReactiveVar } from 'meteor/reactive-var';

export const Groups = {
    collections: {},
    collection( organizationId ){
        if( !Groups.collections[organizationId] ){
            Groups.collections[organizationId] = new Mongo.Collection( Groups.collectionName( organizationId ));
            if( Meteor.isServer ){
                Groups.collections[organizationId].deny({
                    insert(){ return true; },
                    update(){ return true; },
                    remove(){ return true; },
                });
            }
        }
        return Groups.collections[organizationId];
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
