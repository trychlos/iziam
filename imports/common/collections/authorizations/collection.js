/*
 * /imports/common/collections/authorizations/collection.js
 */

import { Mongo } from 'meteor/mongo';
import { ReactiveVar } from 'meteor/reactive-var';
import SimpleSchema from 'meteor/aldeed:simple-schema';
import { Tracker } from 'meteor/tracker';

export const Authorizations = {
    collections: {},
    tabulars: {},
    collection( organizationId ){
        if( !Authorizations.collections[organizationId] ){
            const c = new Mongo.Collection( Authorizations.collectionName( organizationId ));
            if( Meteor.isServer ){
                c.deny({
                    insert(){ return true; },
                    update(){ return true; },
                    remove(){ return true; },
                });
            }
            Tracker.autorun(() => {
                const fieldSet = Authorizations.fieldSet.get();
                if( fieldSet ){
                    c.attachSchema( new SimpleSchema( fieldSet.toSchema()), { replace: true });
                    c.attachBehaviour( 'timestampable' );
                }
            });
            Authorizations.collections[organizationId] = c;
        }
        return Authorizations.collections[organizationId];
    },
    collectionName( organizationId ){
        return 'authorizations_'+organizationId;
    },
    isAuthorizations( name ){
        return name.startsWith( 'authorizations_' );
    },
    scope( name ){
        return name.replace( /^authorizations_/, '' );
    },
    fieldSet: new ReactiveVar( null )
};
