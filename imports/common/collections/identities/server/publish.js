/*
 * /imports/common/collections/identities/server/publish.js
 */

//import { publishComposite } from 'meteor/reywood:publish-composite';

//import { Groups } from '/imports/collections/groups/groups.js';
//import { Memberships } from '/imports/collections/memberships/memberships.js';

import { Identities } from '../index.js';

/*
 * returns a cursor of all identities for the organization, published here as a 'identities_all' pseudo collection
 *  where each item is an identity, and contains a DYN sub-object with:
 *  - memberships
 * @param {Object} organizationId
 */
Meteor.publish( Meteor.APP.C.pub.identitiesAll.publish, async function(){
    if( !await Permissions.isAllowed( 'feat.identities.pub.list_all', this.userId )){
        this.ready();
        return false;
    }
    const self = this;
    let initializing = true;
    const collectionName = Meteor.APP.C.pub.identitiesAll.collection;
    
    // find ORG_SCOPED_MANAGER allowed users, and add to each entity the list of its records
    const f_transform = async function( item ){
        item.DYN = {
            memberships: []
        };
        let promises = [];
        /*
        promises.push( Meteor.roleAssignment.find({ 'role._id': 'ORG_SCOPED_MANAGER', scope: item._id }).fetchAsync().then(( fetched ) => {
            fetched.forEach(( it ) => {
                Meteor.users.findOneAsync({ _id: it.user._id }).then(( user ) => {
                    if( user ){
                        item.DYN.managers.push( user );
                    } else {
                        console.warn( 'user not found, but allowed by an assigned scoped role', it.user._id );
                    }
                });
            });
            return true;
        }));
        */
        return Promise.allSettled( promises ).then(() => {
            return item;
        });
    };

    const observer = Meteor.APP.AccountsManager.identities.collectionDb().find().observeAsync({
        added: async function( item ){
            self.added( collectionName, item._id, await f_transform( item ));
        },
        changed: async function( newItem, oldItem ){
            if( !initializing ){
                self.changed( collectionName, newItem._id, await f_transform( newItem ));
            }
        },
        removed: async function( oldItem ){
            self.removed( collectionName, oldItem._id );
        }
    });

    initializing = false;
    self.onStop( function(){
        observer.then(( handle ) => { handle.stop(); });
    });
    self.ready();
});
