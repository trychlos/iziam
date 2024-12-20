/*
 * /imports/common/collections/clients_groups/server/publish.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import strftime from 'strftime';

import { AccountsHub } from 'meteor/pwix:accounts-hub';

import { Clients } from '/imports/common/collections/clients/index.js';

import { ClientsGroups } from '../index.js';

// returns the list of known groups for a given organization
//  the list of (direct) members as an array of <ClientsGroups> objects
Meteor.publish( 'clients_groups.listAll', async function( organizationId ){
    if( !organizationId ){
        this.ready();
        return [];
    }
    if( !await Permissions.isAllowed( 'feat.clients_groups.list', this.userId, organizationId )){
        this.ready();
        return false;
    }
    const self = this;
    let initializing = true;

    // set the name if the item is a client
    const f_transform = async function( item ){
        item.DYN = item.DYN || {};
        // set the name if the item is a client
        if( item.type === 'C' ){
            const client = await Clients.s.getByEntity( item.organization, item.client, self.userId );
            if( client ){
                item.DYN.label = client.DYN.closest.label;
            } else {
                item.DYN.label = '<client \''+item.client+'\' not found>';
            }
        }
        item.DYN.updatedAt = strftime( '%Y-%m-%d %H:%M:%S', item.updatedAt || item.createdAt );
        const ahInstance = AccountsHub.instances['users'];
        const preferred = await ahInstance.preferredLabel( item.updatedBy || item.createdBy );
        item.DYN.updatedBy = preferred.label;
        return item;
    };

    // in order the same query may be applied on client side, we have to add to item required fields
    const observer = ClientsGroups.collection( organizationId ).find({ organization: organizationId }).observeAsync({
        added: async function( item ){
            self.added( ClientsGroups.collectionName( organizationId ), item._id, await f_transform( item ));
            //console.debug( 'added', item._id );
        },
        changed: async function( newItem, oldItem ){
            self.changed( ClientsGroups.collectionName( organizationId ), newItem._id, await f_transform( newItem ));
            //console.debug( 'changed', newItem._id );
        },
        removed: function( oldItem ){
            self.removed( ClientsGroups.collectionName( organizationId ), oldItem._id, oldItem );
            //console.debug( 'removed', oldItem._id );
        }
    });

    initializing = false;
    self.onStop( function(){
        observer.then(( handle ) => { handle.stop(); });
    });
    self.ready();
});
