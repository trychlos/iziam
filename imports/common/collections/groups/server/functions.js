/*
 * /imports/common/collections/groups/server/functions.js
 */

import _ from 'lodash';

//import { Memberships } from '/imports/collections/memberships/memberships.js';

import { Groups } from '../index.js';

Groups.s = {
    // returns the queried items
    async getBy( query ){
        const res = await Groups.collection.find( query ).fetchAsync();
        return res;
    },

    // returns {Promises} which eventually resolves to all groups for an organization
    async listAll( organization ){
        return await Groups.collection.find({ organization: organization }).fetchAsync();
    },

    // delete a group
    async removeById( id, userId ){
        let res = Groups.collection.removeAsync({ _id: id });
        //Memberships.s.removeByGroup( id );
        return res;
    },

    // @returns {Object} the upsert result
    async upsert( item, groups, identities, userId ){
        console.debug( 'Groups.s.upsert', item, groups, identities );
        // save the DYN sub-object to restore it later, but not be written in dbms
        const DYN = item.DYN;
        delete item.DYN;
        console.debug( 'item', item );
        const res = await Groups.collection.upsertAsync({ _id: item._id }, { $set: item });
        // get the newly inserted id
        if( res.insertedId ){
            item._id = res.insertedId;
        }
        //if( res.numberAffected ){
        //    Memberships.s.upsertByGroup( item.organization, item._id, groups, identities, userId );
        //}
        item.DYN = DYN;
        console.debug( 'Groups.upsert', res );
        return res;
    }
};
