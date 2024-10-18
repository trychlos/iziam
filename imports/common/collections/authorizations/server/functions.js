/*
 * /imports/common/collections/authorizations/server/functions.js
 */

import _ from 'lodash';

import { Permissions } from 'meteor/pwix:permissions';

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
