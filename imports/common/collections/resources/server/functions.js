/*
 * /imports/common/collections/resources/server/functions.js
 */

import _ from 'lodash';

import { Permissions } from 'meteor/pwix:permissions';

import { Resources } from '../index.js';

Resources.s = _.merge( Resources.s, {

    // returns the queried items
    async getBy( organizationId, query ){
        return await Resources.collection( organizationId ).find( query ).fetchAsync();
    },

    // remove an identified authorization
    async removeById( organizationId, id ){
        const res = Resources.collection( organizationId ).removAsync({ _id: id });
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
