/*
 * /imports/common/collections/identities/server/publish.js
 */

//import { publishComposite } from 'meteor/reywood:publish-composite';

//import { Groups } from '/imports/collections/groups/groups.js';
//import { Memberships } from '/imports/collections/memberships/memberships.js';

import { Identities } from '../index.js';

/*
publishComposite( 'identities.allComposite', ( organization ) => {
    return {
        collectionName: 'composite.Identities',
        find(){
            const query = organization ? { organization: organization } : {};
            return Identities.find( query );
        },
        children: [
            {
                collectionName: 'composite.Memberships',
                find( identity ){
                    return Memberships.find({ child: identity._id });
                },
                children: [
                    {
                        collectionName: 'composite.Groups',
                        find( membership ){
                            return Groups.find({ _id: membership.group })
                        }
                    }
                ]
            }
        ]
    };
});
*/

// returns the list of known identities for a given organization (of for all organizations if unset)
//  join the mebership to each identity
Meteor.publish( 'identities.listAll', function( organization ){
    const query = organization ? { organization: organization } : {};
    const self = this;
    const collection_name = 'identities';
    const userId = this.userId;

    // membership is the array of the groups the identity is member of
    const f_transform = function( item ){
        item.DYN = {
            membership: []
        };
        /*
        Memberships.find({ child: item._id }).fetch().every(( doc ) => {
            doc.o = Groups.findOne({ _id: doc.group });
            item.DYN.membership.push( doc );
            return true;
        });
        */
        return item;
    };

    // in order the same query may be applied on client side, we have to add to item required fields
    /*
    const observer = Identities.find( query ).observe({
        added: function( item ){
            if( Meteor.APP.Run.publishIsAllowed( userId, 'identities' )){
                self.added( collection_name, item._id, f_transform( item ));
            }
        },
        changed: function( newItem, oldItem ){
            if( Meteor.APP.Run.publishIsAllowed( userId, 'identities' )){
                self.changed( collection_name, newItem._id, f_transform( newItem ));
            }
        },
        removed: function( oldItem ){
            if( Meteor.APP.Run.publishIsAllowed( userId, 'identities' )){
                self.removed( collection_name, oldItem._id, oldItem );
            }
        }
    });
    */

    self.onStop( function(){
        observer.stop();
    });

    self.ready();
});
