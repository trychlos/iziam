/*
 * /imports/common/collections/resources/server/functions.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Permissions } from 'meteor/pwix:permissions';

import { Resources } from '../index.js';

Resources.s = _.merge( Resources.s, {

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
        res = Resources.collection( organizationId ).removAsync({ _id: itemId });
        Resources.s.eventEmitter.emit( 'delete', { organizationId: organizationId, userId: userId });
        console.debug( 'Authorizations.removeById', res );
        return res;
    },

    // @returns {Object} the upsert result
    async upsert( organizationId, item, userId ){
        const isNew = !Boolean( item.createdAt );
        let res = await Permissions.isAllowed( isNew ? 'feat.resources.create' : 'feat.resources.edit', userId, organizationId );
        if( !res ){
            return false;
        }
        const DYN = item.DYN;
        const itemId = item._id;
        delete item.DYN;
        delete item._id;
        res = await Resources.collection( organizationId ).upsertAsync({ _id: itemId }, { $set: item });
        Resources.s.eventEmitter.emit( 'upsert', { organizationId: organizationId, userId: userId });
        item.DYN = DYN || {};
        item._id = itemId;
        console.debug( 'Resources.s.upsert() res', res );
        return res;
    }
});
