/*
 * /imports/common/collections/authorizations/server/functions.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Permissions } from 'meteor/pwix:permissions';

import { Clients } from '/imports/common/collections/clients/index.js';
import { ClientsGroups } from '/imports/common/collections/clients_groups/index.js';
import { IdentitiesGroups } from '/imports/common/collections/identities_groups/index.js';
import { Resources } from '/imports/common/collections/resources/index.js';

import { Authorizations } from '../index.js';

Authorizations.s = _.merge( Authorizations.s, {

    // @summary Make sure all the fields of the fieldset are set in the item, even if undefined
    // @param {Object} item
    // @returns {Object} item
    addUndef( item ){
        Authorizations.fieldSet.get().names().forEach(( it ) => {
            if( it.indexOf( '.' ) === -1 && !Object.keys( item ).includes( it )){
                item[it] = undefined;
            }
        });
        return item;
    },

    // returns the queried items
    // when dealing from an external identity, we expect userId=null and opts.from=<organizationId>
    async getBy( organizationId, query, userId, opts={} ){
        if( !await Permissions.isAllowed( 'feat.authorizations.list', userId, organizationId, opts )){
            return [];
        }
        return await Authorizations.collection( organizationId ).find( query ).fetchAsync();
    },

    // remove an identified authorization
    async removeById( organizationId, id, userId ){
        if( !await Permissions.isAllowed( 'feat.authorizations.delete', userId, organizationId )){
            return false;
        }
        const res = await Authorizations.collection( organizationId ).removeAsync({ _id: id });
        console.debug( 'Authorizations.removeById', res );
        return res;
    },

    // transform the published/returned document
    async transform( organizationId, item, userId, opts={} ){
        item.DYN = item.DYN || {};
        if( item.subject_type === 'C' ){
            const subject = await ClientsGroups.s.getBy( organizationId, { _id: item.subject_id }, userId, opts );
            if( subject && subject.length ){
                item.DYN.subject_label = subject[0].label;
            }
        }
        if( item.subject_type === 'I' ){
            const subject = await IdentitiesGroups.s.getBy( organizationId, { _id: item.subject_id }, userId, opts );
            if( subject && subject.length ){
                item.DYN.subject_label = subject[0].label;
            }
        }
        if( item.object_type === 'C' ){
            const object = await Clients.s.getByEntity( organizationId, item.object_id, userId, opts );
            if( object ){
                item.DYN.object_label = object.DYN.closest.label;
            } else {
                console.warn( 'Clients.s.getByEntity() not found', item.object_id );
            }
        }
        if( item.object_type === 'R' ){
            const object = await Resources.s.getBy( organizationId, { _id: item.object_id }, userId, opts );
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
    // when dealing from an external identity, we expect userId=null and opts.from=<organizationId>
    async transformedGetBy( organizationId, query, userId, opts={} ){
        let gots = [];
        const fetched = await Authorizations.s.getBy( organizationId, query, userId, opts );
        for await( const it of fetched ){
            const transformed = await Authorizations.s.transform( organizationId, it, userId, opts );
            gots.push( transformed );
        }
        return gots;
    },

    // @returns {Object} the upsert result with:
    //  - updated: the count of updated documents
    //  - inserted: the count od inserted documents
    async upsert( organizationId, item, userId ){
        if( !await Permissions.isAllowed( 'feat.authorizations.create', userId, organizationId )){
            return false;
        }
        let res = {
            updated: 0,
            inserted: 0
        };
        const DYN = item.DYN;
        delete item.DYN;
        let itemId = item._id;
        if( item.createdAt ){
            res.updated = await Authorizations.collection( organizationId ).updateAsync({ _id: item._id }, { $set: item });
        } else {
            const foo = await Authorizations.collection( organizationId ).insertAsync( item );
            res.inserted += 1;
            itemId = foo.insertedId;
        }
        item.DYN = DYN || {};
        item._id = itemId;
        console.debug( 'Authorizations.upsert', res );
        return res;
    }
});
