/*
 * /imports/common/collections/clients_groups/server/functions.js
 */

import _ from 'lodash';

import { ClientsGroups } from '../index.js';

ClientsGroups.s = _.merge( ClientsGroups.s, {

    // dump the groups for this organization
    async dump( organizationId ){
        const res = await ClientsGroups.collection( organizationId ).find({ organization: organizationId }, { $sort: { _id: 1 }}).fetchAsync();
        res.forEach(( it ) => {
            console.debug( 'dump', 'organization:'+organizationId, '_id:'+it._id, 'type:'+it.type, 'label:'+it.label, 'parent:'+it.parent, 'client:'+it.client );
        })
        return res;
    },

    // returns the queried items
    async getBy( organizationId, query, userId ){
        const res = await ClientsGroups.collection( organizationId ).find( query ).fetchAsync();
        return res;
    },

    // @returns {Object} the upsert result
    async upsert_item( organizationId, item, userId ){
        // save the DYN sub-object to restore it later, but not be written in dbms
        const DYN = item.DYN;
        delete item.DYN;
        const res = await ClientsGroups.collection( organizationId ).upsertAsync({ _id: item._id }, { $set: item });
        // get the newly inserted id
        if( res.insertedId ){
            item._id = res.insertedId;
        }
        ClientsGroups.s.eventEmitter.emit( 'upsert', { organizationId: organizationId, userId: userId });
        item.DYN = DYN;
        console.debug( 'ClientsGroups.upsert', res );
        return res;
    },

    // Update the groups whose client are members of
    async updateMemberships( organizationId, clientId, memberOf, userId ){
        let res = [];
        // first delete the previous organization records
        //await ClientsGroups.s.dump( organizationId );
        res.push( await ClientsGroups.collection( organizationId ).removeAsync({ organization: organizationId, type: 'C', client: clientId }));
        //await ClientsGroups.s.dump( organizationId );
        // then insert the new memberships
        if( memberOf && memberOf.direct ){
            for await ( const it of ( memberOf.direct || [] )){
                res.push( await ClientsGroups.collection( organizationId ).insertAsync({ organization: organizationId, type: 'C', client: clientId, parent: it }));
            }
        }
        ClientsGroups.s.eventEmitter.emit( 'upsert', { organizationId: organizationId, userId: userId });
        //await ClientsGroups.s.dump( organizationId );
        //console.debug( 'ClientsGroups.s.updateMemberships', res );
        return res;
    },

    // @returns {Object} the upsert result
    async upsert_tree( organizationId, groups, userId ){
        let res = [];
        // first delete the previous organization groups tree
        res.push( await ClientsGroups.collection( organizationId ).removeAsync({ organization: organizationId }));
        // then insert the new groups hierarchy
        if( groups && _.isArray( groups )){
            const flat = ClientsGroups.fn.tree2flat( organizationId, groups );
            for( const it of flat ){
                res.push( await ClientsGroups.collection( organizationId ).upsertAsync({ _id: it._id }, { $set: it }));
            }
            ClientsGroups.s.eventEmitter.emit( 'upsert', { organizationId: organizationId, userId: userId });
        } else {
            console.warn( 'ClientsGroups.s.upsert_tree() expects an array of groups, got '+groups );
        }
        console.debug( 'res', res );
        return res;
    }
});
