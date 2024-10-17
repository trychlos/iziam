/*
 * /imports/common/collections/resources/collection.js
 */

import { Mongo } from 'meteor/mongo';
import { ReactiveVar } from 'meteor/reactive-var';
import SimpleSchema from 'meteor/aldeed:simple-schema';
import { Tracker } from 'meteor/tracker';

export const Resources = {
    collections: {},
    tabulars: {},
    collection( organizationId ){
        if( !Resources.collections[organizationId] ){
            const c = new Mongo.Collection( Resources.collectionName( organizationId ));
            if( Meteor.isServer ){
                c.deny({
                    insert(){ return true; },
                    update(){ return true; },
                    remove(){ return true; },
                });
            }
            Tracker.autorun(() => {
                const fieldSet = Resources.fieldSet.get();
                if( fieldSet ){
                    c.attachSchema( new SimpleSchema( fieldSet.toSchema()), { replace: true });
                    c.attachBehaviour( 'timestampable' );
                }
            });
            Resources.collections[organizationId] = c;
        }
        return Resources.collections[organizationId];
    },
    collectionName( organizationId ){
        return 'resources_'+organizationId;
    },
    isAuthorizations( name ){
        return name.startsWith( 'resources_' );
    },
    scope( name ){
        return name.replace( /^resources_/, '' );
    },
    fieldSet: new ReactiveVar( null )
};
