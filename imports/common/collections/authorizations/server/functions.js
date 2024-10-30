/*
 * /imports/common/collections/authorizations/server/functions.js
 */

import _ from 'lodash';

import { Permissions } from 'meteor/pwix:permissions';

import { Clients } from '/imports/common/collections/clients/index.js';
import { ClientsGroups } from '/imports/common/collections/clients_groups/index.js';
import { IdentitiesGroups } from '/imports/common/collections/identities_groups/index.js';
import { Resources } from '/imports/common/collections/resources/index.js';

import { Authorizations } from '../index.js';

Authorizations.s = _.merge( Authorizations.s, {

    // returns the queried items
    async getBy( organizationId, query, userId ){
        return await Authorizations.collection( organizationId ).find( query ).fetchAsync();
    },

    // remove an identified authorization
    async removeById( organizationId, id, userId ){
        if( !await Permissions.isAllowed( 'feat.authorizations.delete', userId, organizationId )){
            return false;
        }
        const res = await Authorizations.collection( organizationId ).removAsync({ _id: id });
        console.debug( 'Authorizations.removeById', res );
        return res;
    },

    // transform the published/returned document
    async transform( organizationId, item, userId ){
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
                item.DYN.object_label = object.DYN.closest.label;
            } else {
                console.warn( 'Clients.s.getByEntity() not found', item.object_id );
            }
        }
        if( item.object_type === 'R' ){
            const object = await Resources.s.getBy( organizationId, { _id: item.object_id }, userId );
            if( object && object.length ){
                item.DYN.object_label = object[0].name;
            }
        }
        // have a computed label
        item.DYN.computed_label = Authorizations.fn.label( item );
        // have permissions labels
        item.DYN.permissions = [];
        ( item.permissions || [] ).forEach(( it ) => {
            item.DYN.permissions.push( it.label );
        });
        return item;
    },

    // returns the queried items
    async transformedGetBy( organizationId, query, userId ){
        let gots = [];
        const fetched = await Authorizations.s.getBy( organizationId, query, userId );
        for await( const it of fetched ){
            const transformed = await Authorizations.s.transform( organizationId, it, userId );
            gots.push( transformed );
        }
        return gots;
    },

    // @returns {Object} the upsert result
    async upsert( organizationId, item, userId ){
        if( !await Permissions.isAllowed( 'feat.authorizations.create', userId, organizationId )){
            return false;
        }
        const DYN = item.DYN;
        delete item.DYN;
        const res = await Authorizations.collection( organizationId ).upsertAsync({ _id: item._id }, { $set: item });
        item.DYN = DYN || {};
        if( res.insertedId ){
            item._id = res.insertedId;
        }
        console.debug( 'Authorizations.upsert', res );
        return res;
    }
});
