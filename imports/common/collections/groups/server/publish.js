/*
 * /imports/common/collections/groups/server/publish.js
 */

import { Identities } from '/imports/common/collections/identities/index.js';
//import { Memberships } from '/imports/collections/memberships/memberships.js';

import { Groups } from '../index.js';

// returns the list of known groups for a given organization (of for all organizations if unset)
//  the list of (direct) members as an array of <Groups> of <Identities> objects
Meteor.publish( 'groups.listAll', function( organization ){
    const query = organization ? { organization: organization } : {};
    const self = this;
    const collection_name = 'groups';
    const userId = this.userId;

    // members is the array of Groups and Identities which are member of this group
    // membership is the array of groups this group is member of
    const f_transform = function( item ){
        item.DYN = {
            members: [],
            membership: []
        };
        Memberships.find({ group: item._id }).fetch().every(( doc ) => {
            doc.o = doc.type === 'G' ? Groups.findOne({ _id: doc.child }) : Identities.findOne({ _id: doc.child });
            item.DYN.members.push( doc );
            return true;
        });
        Memberships.find({ child: item._id }).fetch().every(( doc ) => {
            doc.o = Groups.findOne({ _id: doc.group });
            item.DYN.membership.push( doc );
            return true;
        });
        return item;
    };

    // in order the same query may be applied on client side, we have to add to item required fields
    const observer = Groups.find( query ).observe({
        added: function( item ){
            if( Meteor.APP.Run.publishIsAllowed( userId, 'groups' )){
                self.added( collection_name, item._id, f_transform( item ));
            }
        },
        changed: function( newItem, oldItem ){
            if( Meteor.APP.Run.publishIsAllowed( userId, 'groups' )){
                self.changed( collection_name, newItem._id, f_transform( newItem ));
            }
        },
        removed: function( oldItem ){
            if( Meteor.APP.Run.publishIsAllowed( userId, 'groups' )){
                self.removed( collection_name, oldItem._id, oldItem );
            }
        }
    });

    self.onStop( function(){
        observer.stop();
    });

    self.ready();
});
