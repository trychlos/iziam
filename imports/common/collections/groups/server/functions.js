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
    async upsert_item( item, userId ){
        // save the DYN sub-object to restore it later, but not be written in dbms
        const DYN = item.DYN;
        delete item.DYN;
        const res = await Groups.collection.upsertAsync({ _id: item._id }, { $set: item });
        // get the newly inserted id
        if( res.insertedId ){
            item._id = res.insertedId;
        }
        //if( res.numberAffected ){
        //    Memberships.s.upsertByGroup( item.organization, item._id, groups, identities, userId );
        //}
        item.DYN = DYN;
        console.debug( 'Groups.upsert_item', res );
        return res;
    },

    // @returns {Object} the upsert result
    async upsert_tree( organizationId, groups, userId ){
        let res = [];
        // first delete the previous organization groups tree
        res.push( await Groups.collection.removeAsync({ organization: organizationId }));
        // then insert the new groups hierarchy
        if( groups && _.isArray( groups ) && groups.length ){
            const flat = Groups.fn.tree2flat( organizationId, groups );
            flat.forEach( async ( it ) => {
                res.push( await Groups.collection.upsertAsync({ _id: it._id }, { $set: it }));
            });
        } else {
            console.warn( 'Groups.s.upsert_tree() expects an array of groups, got '+groups );
        }
        console.debug( 'res', res );
        return res;
    }
};
