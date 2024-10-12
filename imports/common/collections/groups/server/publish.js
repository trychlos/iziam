/*
 * /imports/common/collections/groups/server/publish.js
 */

import { Identities } from '/imports/common/collections/identities/index.js';
//import { Memberships } from '/imports/collections/memberships/memberships.js';

import { Groups } from '../index.js';

// returns the list of known groups for a given organization
//  the list of (direct) members as an array of <Groups> objects
Meteor.publish( 'groups.listAll', async function( organization ){
    if( !organization ){
        this.ready();
        return [];
    }
    if( !await Permissions.isAllowed( 'feat.groups.list', this.userId, organization._id )){
        this.ready();
        return false;
    }
    const self = this;
    let initializing = true;

    // members is the array of Groups and Identities which are member of this group
    // membership is the array of groups this group is member of
    const f_transform = function( item ){
        item.DYN = {
            //members: [],
            //membership: []
        };
        /*
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
        */
        return item;
    };

    // in order the same query may be applied on client side, we have to add to item required fields
    const observer = Groups.collection.find({ organization: organization._id }).observeAsync({
        added: function( item ){
            self.added( Groups.collectionName, item._id, f_transform( item ));
        },
        changed: function( newItem, oldItem ){
            self.changed( Groups.collectionName, newItem._id, f_transform( newItem ));
        },
        removed: function( oldItem ){
            self.removed( Groups.collectionName, oldItem._id, oldItem );
        }
    });

    initializing = false;
    self.onStop( function(){
        observer.then(( handle ) => { handle.stop(); });
    });
    self.ready();
});
