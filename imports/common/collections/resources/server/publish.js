/*
 * /imports/common/collections/resources/server/publish.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Resources } from '../index.js';

// returns the list of known resources for a given organization
Meteor.publish( 'resources_list_all', async function( organizationId ){
    if( !organizationId ){
        this.ready();
        return [];
    }
    if( !await Permissions.isAllowed( 'feat.resources.list', this.userId, organizationId )){
        this.ready();
        return false;
    }
    const self = this;
    let initializing = true;

    const f_transform = async function( item ){
        item.DYN = item.DYN || {};
        Resources.s.addUndef( item );
        return item;
    };

    const observer = Resources.collection( organizationId ).find({ organization: organizationId }).observeAsync({
        added: async function( item ){
            self.added( Resources.collectionName( organizationId ), item._id, await f_transform( item ));
        },
        changed: async function( newItem, oldItem ){
            if( !initializing ){
                self.changed( Resources.collectionName( organizationId ), newItem._id, await f_transform( newItem ));
            }
        },
        removed: function( oldItem ){
            self.removed( Resources.collectionName( organizationId ), oldItem._id );
        }
    });

    initializing = false;
    self.onStop( function(){
        observer.then(( handle ) => { handle.stop(); });
    });
    self.ready();
});
