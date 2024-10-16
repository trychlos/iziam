/*
 * /imports/common/collections/groups/server/functions.js
 */

import _ from 'lodash';

//import { Memberships } from '/imports/collections/memberships/memberships.js';

import { Groups } from '../index.js';

Groups.s = {
    // dump the groups for this organization
    async dump( organizationId ){
        const res = await Groups.collection.find({ organization: organizationId }, { $sort: { _id: 1 }}).fetchAsync();
        res.forEach(( it ) => {
            console.debug( 'dump', 'organization:'+organizationId, '_id:'+it._id, 'type:'+it.type, 'label:'+it.label, 'parent:'+it.parent, 'identity:'+it.identity );
        })
        return res;
    },

    // returns the queried items
    async getBy( query, userId ){
        const res = await Groups.collection.find( query ).fetchAsync();
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

    // Update the groups whose identity are members of
    async updateMemberships( organizationId, identityId, memberOf, userId ){
        let res = [];
        // first delete the previous organization records
        //await Groups.s.dump( organizationId );
        res.push( await Groups.collection.removeAsync({ organization: organizationId, type: 'I', identity: identityId }));
        //await Groups.s.dump( organizationId );
        // then insert the new memberships
        for await ( const it of ( memberOf.direct || [] )){
            res.push( await Groups.collection.insertAsync({ organization: organizationId, type: 'I', identity: identityId, parent: it }));
        }
        //await Groups.s.dump( organizationId );
        //console.debug( 'Groups.s.updateMemberships', res );
        return res;
    },

    // @returns {Object} the upsert result
    async upsert_tree( organizationId, groups, userId ){
        let res = [];
        // first delete the previous organization groups tree
        res.push( await Groups.collection.removeAsync({ organization: organizationId }));
        // then insert the new groups hierarchy
        if( groups && _.isArray( groups )){
            const flat = Groups.fn.tree2flat( organizationId, groups );
            for( const it of flat ){
                res.push( await Groups.collection.upsertAsync({ _id: it._id }, { $set: it }));
            }
        } else {
            console.warn( 'Groups.s.upsert_tree() expects an array of groups, got '+groups );
        }
        console.debug( 'res', res );
        return res;
    }
};
