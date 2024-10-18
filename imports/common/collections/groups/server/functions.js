/*
 * /imports/common/collections/groups/server/functions.js
 */

import _ from 'lodash';

import { Groups } from '../index.js';

Groups.s = _.merge( Groups.s, {

    // dump the groups for this organization
    async dump( organizationId ){
        const res = await Groups.collection( organizationId ).find({ organization: organizationId }, { $sort: { _id: 1 }}).fetchAsync();
        res.forEach(( it ) => {
            console.debug( 'dump', 'organization:'+organizationId, '_id:'+it._id, 'type:'+it.type, 'label:'+it.label, 'parent:'+it.parent, 'identity:'+it.identity );
        })
        return res;
    },

    // returns the queried items
    async getBy( organizationId, query, userId ){
        const res = await Groups.collection( organizationId ).find( query ).fetchAsync();
        return res;
    },

    // @returns {Object} the upsert result
    async upsert_item( organizationId, item, userId ){
        // save the DYN sub-object to restore it later, but not be written in dbms
        const DYN = item.DYN;
        delete item.DYN;
        /*
        const orig = await Groups.collection( organizationId ).findOneAsync({ _id: item._id });
        let res;
        if( orig ){
            res = await Groups.collection( organizationId ).updateAsync({ _id: item._id }, { $set: item });
        } else {
            res = await Groups.collection( organizationId ).insertAsync({ _id: item._id }, { $set: item });
        }
        */
        const res = await Groups.collection( organizationId ).upsertAsync({ _id: item._id }, { $set: item });
        // get the newly inserted id
        if( res.insertedId ){
            item._id = res.insertedId;
        }
        Groups.s.eventEmitter.emit( 'upsert', { organizationId: organizationId, userId: userId });
        item.DYN = DYN;
        console.debug( 'Groups.upsert', res );
        return res;
    },

    // Update the groups whose identity are members of
    async updateMemberships( organizationId, identityId, memberOf, userId ){
        let res = [];
        // first delete the previous organization records
        //await Groups.s.dump( organizationId );
        res.push( await Groups.collection( organizationId ).removeAsync({ organization: organizationId, type: 'I', identity: identityId }));
        //await Groups.s.dump( organizationId );
        // then insert the new memberships
        if( memberOf && memberOf.direct ){
            for await ( const it of ( memberOf.direct || [] )){
                res.push( await Groups.collection( organizationId ).insertAsync({ organization: organizationId, type: 'I', identity: identityId, parent: it }));
            }
        }
        Groups.s.eventEmitter.emit( 'upsert', { organizationId: organizationId, userId: userId });
        //await Groups.s.dump( organizationId );
        //console.debug( 'Groups.s.updateMemberships', res );
        return res;
    },

    // @returns {Object} the upsert result
    async upsert_tree( organizationId, groups, userId ){
        let res = [];
        // first delete the previous organization groups tree
        res.push( await Groups.collection( organizationId ).removeAsync({ organization: organizationId }));
        // then insert the new groups hierarchy
        if( groups && _.isArray( groups )){
            const flat = Groups.fn.tree2flat( organizationId, groups );
            for( const it of flat ){
                /*
                const orig = await Groups.collection( organizationId ).findOneAsync({ _id: it._id });
                if( orig ){
                    res.push( await Groups.collection( organizationId ).updateAsync({ _id: it._id }, { $set: it }));
                } else {
                    res.push( await Groups.collection( organizationId ).insertAsync( it ));
                }
                    */
                res.push( await Groups.collection( organizationId ).upsertAsync({ _id: it._id }, { $set: it }));
            }
            Groups.s.eventEmitter.emit( 'upsert', { organizationId: organizationId, userId: userId });
        } else {
            console.warn( 'Groups.s.upsert_tree() expects an array of groups, got '+groups );
        }
        console.debug( 'res', res );
        return res;
    }
});
