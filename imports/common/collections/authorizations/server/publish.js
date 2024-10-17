/*
 * /imports/common/collections/authorizations/server/publish.js
 */

import { Permissions } from 'meteor/pwix:permissions';

import { Authorizations } from '../index.js';

// returns the list of known authorizations for a given organization
Meteor.publish( 'authorizations_list_all', async function( organizationId ){
    if( !organizationId ){
        this.ready();
        return [];
    }
    if( !await Permissions.isAllowed( 'feat.authorizations.list', this.userId, organizationId )){
        this.ready();
        return false;
    }
    const self = this;
    let initializing = true;

    const f_transform = async function( item ){
        item.DYN = item.DYN || {};
        return item;
    };

    // in order the same query may be applied on client side, we have to add to item required fields
    const observer = Authorizations.collection( organizationId ).find({ organization: organizationId }).observeAsync({
        added: async function( item ){
            self.added( Authorizations.collectionName( organizationId ), item._id, await f_transform( item ));
            //console.debug( 'added', item._id );
        },
        changed: async function( newItem, oldItem ){
            self.changed( Authorizations.collectionName( organizationId ), newItem._id, await f_transform( newItem ));
            //console.debug( 'changed', newItem._id );
        },
        removed: function( oldItem ){
            self.removed( Authorizations.collectionName( organizationId ), oldItem._id, oldItem );
            //console.debug( 'removed', oldItem._id );
        }
    });

    initializing = false;
    self.onStop( function(){
        observer.then(( handle ) => { handle.stop(); });
    });
    self.ready();
});
