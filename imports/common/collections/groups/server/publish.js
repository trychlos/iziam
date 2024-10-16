/*
 * /imports/common/collections/groups/server/publish.js
 */

import { Identities } from '/imports/common/collections/identities/index.js';

import { Groups } from '../index.js';

// returns the list of known groups for a given organization
//  the list of (direct) members as an array of <Groups> objects
Meteor.publish( 'groups.listAll', async function( organizationId ){
    if( !organizationId ){
        this.ready();
        return [];
    }
    if( !await Permissions.isAllowed( 'feat.groups.list', this.userId, organizationId )){
        this.ready();
        return false;
    }
    const self = this;
    let initializing = true;

    // set the name if the item is an identity
    const f_transform = async function( item ){
        item.DYN = item.DYN || {};
        // set the name if the item is an identity
        if( item.type === 'I' ){
            const identities = await Identities.s.getBy( item.organization, { _id: item.identity }, self.userId );
            if( identities && identities.length ){
                item.DYN.label = Identities.fn.label( identities[0] );
            } else {
                item.DYN.label = '<identity \''+item.identity+'\' not found>';
            }
        }
        //console.debug( 'item', item );
        return item;
    };

    // in order the same query may be applied on client side, we have to add to item required fields
    const observer = Groups.collection.find({ organization: organizationId }).observeAsync({
        added: async function( item ){
            console.debug( 'added', item._id );
            self.added( Groups.collectionName, item._id, await f_transform( item ));
        },
        changed: async function( newItem, oldItem ){
            console.debug( 'changed', newItem._id );
            self.changed( Groups.collectionName, newItem._id, await f_transform( newItem ));
        },
        removed: function( oldItem ){
            console.debug( 'removed', oldItem._id );
            self.removed( Groups.collectionName, oldItem._id, oldItem );
        }
    });

    initializing = false;
    self.onStop( function(){
        observer.then(( handle ) => { handle.stop(); });
    });
    self.ready();
});
