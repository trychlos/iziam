/*
 * /imports/common/collections/authorizations/server/publish.js
 */

import { Permissions } from 'meteor/pwix:permissions';

import { Clients } from '/imports/common/collections/clients/index.js';
import { ClientsGroups } from '/imports/common/collections/clients_groups/index.js';
import { IdentitiesGroups } from '/imports/common/collections/identities_groups/index.js';
import { Resources } from '/imports/common/collections/resources/index.js';

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
    const f_transform = async function( item ){
        item.DYN = item.DYN || {};
        if( item.subject_type === 'C' ){
            const subject = await ClientsGroups.s.getBy( organizationId, { _id: item.subject_id }, userId );
            if( subject && subject.length ){
                item.DYN.subject_label = subject[0].label;
            }
        }
        if( item.subject_type === 'I' ){
            const subject = await IdentitiesGroups.s.getBy( organizationId, { _id: item.subject_id }, userId );
            if( subject && subject.length ){
                item.DYN.subject_label = subject[0].label;
            }
        }
        if( item.object_type === 'C' ){
            const object = await Clients.s.getByEntity( organizationId, item.object_id, userId );
            if( object ){
                item.DYN.object_label = object.closest.label;
            }
        }
        if( item.object_type === 'R' ){
            const object = await Resources.s.getBy( organizationId, { _id: item.object_id }, userId );
            if( object && object.length ){
                item.DYN.object_label = object[0].name;
            }
        }
        item.computed_label = [ item.subject_type, item.DYN.subject_label, item.object_type, item.DYN.object_label ].join( '-' );
        let permissions = [];
        ( item.permissions || [] ).forEach(( it ) => {
            permissions.push( it.label );
        });
        item.DYN.permissions = permissions.join( ', ' );
        return item;
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
