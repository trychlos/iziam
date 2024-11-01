/*
 * /imports/common/collections/authorizations/server/publish.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

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
    const userId = this.userId;
    let initializing = true;

    // have labels for subject and object
    // have a computed label
    // have permissions labels
    const f_transform = async function( item ){
        return await Authorizations.s.transform( organizationId, item, userId );
    };

    // in order the same query may be applied on client side, we have to add to item required fields
    const observer = Authorizations.collection( organizationId ).find({ organization: organizationId }).observeAsync({
        added: async function( item ){
            self.added( Authorizations.collectionName( organizationId ), item._id, await f_transform( item ));
        },
        changed: async function( newItem, oldItem ){
            self.changed( Authorizations.collectionName( organizationId ), newItem._id, await f_transform( newItem ));
        },
        removed: function( oldItem ){
            self.removed( Authorizations.collectionName( organizationId ), oldItem._id, oldItem );
        }
    });

    initializing = false;
    self.onStop( function(){
        observer.then(( handle ) => { handle.stop(); });
    });
    self.ready();
});
