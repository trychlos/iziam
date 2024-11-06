/*
 * /imports/common/collections/resources/server/functions.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Permissions } from 'meteor/pwix:permissions';

import { Resources } from '../index.js';

Resources.s = _.merge( Resources.s, {

    /**
     * @summary Make sure all the fields of the fieldset are set in the item, even if undefined
     * @param {Object} item
     * @returns {Object} item
     */
    addUndef( item ){
        Resources.fieldSet.get().names().forEach(( it ) => {
            if( !Object.keys( item ).includes( it )){
                item[it] = undefined;
            }
        });
        return item;
    },

    // when dealing from an external identity, we expect userId=null and opts.from=<organizationId>
    // returns the queried items
    async getBy( organizationId, query, userId, opts={} ){
        if( !await Permissions.isAllowed( 'feat.resources.list', userId, organizationId, opts )){
            return [];
        }
        return await Resources.collection( organizationId ).find( query ).fetchAsync();
    },

    // remove an identified authorization
    async removeById( organizationId, itemId, userId ){
        let res = await Permissions.isAllowed( 'feat.resources.delete', userId, organizationId );
        if( !res ){
            return false;
        }
        res = await Resources.collection( organizationId ).removeAsync({ _id: itemId });
        Resources.s.eventEmitter.emit( 'delete', { organizationId: organizationId, userId: userId });
        console.debug( 'Resources.removeById', res );
        return res;
    },

    // @returns {Object} the upsert result:
    //  - updated: count of updated documents
    //  - inserted: count of inserted documents
    async upsert( organizationId, item, userId ){
        const isNew = !Boolean( item.createdAt );
        let res = await Permissions.isAllowed( isNew ? 'feat.resources.create' : 'feat.resources.edit', userId, organizationId );
        if( !res ){
            return false;
        }
        res = {
            updated: 0,
            inserted: 0
        };
        const DYN = item.DYN;
        let itemId = item._id;
        delete item.DYN;
        delete item._id;
        if( item.createdAt ){
            res.updated = await Resources.collection( organizationId ).updateAsync({ _id: itemId }, { $set: item });
        } else {
            itemId = await Resources.collection( organizationId ).insertAsync( item );
            res.inserted = 1;
        }
        Resources.s.eventEmitter.emit( 'upsert', { organizationId: organizationId, userId: userId });
        item.DYN = DYN || {};
        item._id = itemId;
        console.debug( 'Resources.s.upsert() res', res );
        return res;
    }
});
