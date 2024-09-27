/*
 * /imports/client/components/organization_identities_load/organization_identities_load.js
 *
 * An non-visible component which loads the identities attached to the organization, creating a <organization>.DYN.identities object as:
 * - list: a ReactiveVar which contains the array of the identities
 * - byId( id<String> ): <Identity>: a search function available at '<organization>.DYN.identities.byId()'
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization as an entity with its DYN.records array
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - entityTabs
 * - recordTabs
 */

import { ReactiveVar } from 'meteor/reactive-var';

import { Identities } from '/imports/common/collections/identities/index.js';

import './organization_identities_load.html';

Template.organization_identities_load.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        // the organization item
        organization: new ReactiveVar( null ),
        // the subscription to the clients of the above organization
        handle: new ReactiveVar( null )
    };

    // get the organization entity
    self.autorun(() => {
        const organization = Template.currentData().item.get();
        if( organization ){
            //console.debug( 'organization', organization );
            self.APP.organization.set( organization );
            self.APP.handle.set( self.subscribe( Meteor.APP.C.pub.identitiesAll.publish, organization ));
            organization.DYN.identities = {
                list: new ReactiveVar( [] ),
                byId( identityId ){
                    let found = null;
                    organization.DYN.identities.list.get().every(( it ) => {
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
        }
    });

    // get the list of identities
    // each identity is published as an object with DYN sub-object
    self.autorun(() => {
        if( self.APP.handle.get()?.ready()){
            const organization = self.APP.organization.get();
            Meteor.APP.Collections.get( Meteor.APP.C.pub.identitiesAll.collection ).find( Meteor.APP.C.pub.identitiesAll.query( organization )).fetchAsync().then(( fetched ) => {
                //console.debug( 'fetched', fetched );
                organization.DYN.identities.list.set( fetched );
            });
        }
    });
});
