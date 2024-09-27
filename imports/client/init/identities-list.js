/*
 * /imports/client/init/identities-list.js
 *
 * Maintain a reactive list of the identities
 * 
 * Each identity item is an entity object, with a DYN:
 * - memberships
 */

import { Forms } from 'meteor/pwix:forms';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';
import { Validity } from 'meteor/pwix:validity';

import { Identities } from '/imports/common/collections/identities/index.js';

Meteor.APP.Identities = {
    _handle: Meteor.subscribe( Meteor.APP.C.pub.identitiesAll.publish ),
    _identities: new ReactiveVar( [] ),

    /**
     * @param {String} identityId the identity identifier
     * @returns {Object} the found identity, with its DYN object, or null
     */
    byId( identityId ){
        let found = null;
        Meteor.APP.Identities._identities.get().every(( it ) => {
            if( it._id === identityId ){
                found = it;
            }
            return !found;
        });
        if( !found ){
            console.warn( 'unable to find an identity', identityId );
        }
        return found;
    }
};

// get the list of identities
// each identity is published as an object with DYN { memberships } sub-object
Tracker.autorun(() => {
    if( Meteor.APP.Identities._handle.ready()){
        Meteor.APP.Collections.get( Meteor.APP.C.pub.identitiesAll.collection ).find().fetchAsync().then(( fetched ) => {
            fetched.forEach(( it ) => {
                Identities.fn.DYN( it );
            });
            Meteor.APP.Identities._identities.set( fetched );
            //console.debug( 'fetched', fetched );
        });
    }
});
