/*
 * /imports/common/collections/clients_records/server/functions.js
 */

import _ from 'lodash';
import assert from 'node:assert/strict';

import { check } from 'meteor/check';
import { Permissions } from 'meteor/pwix:permissions';

import { ClientsRecords } from '../index.js';

ClientsRecords.s = {
    /**
     * @summary Make sure all the fields of the fieldset are set in the item, even if undefined
     * @param {Object} item
     * @returns {Object} item
     */
    addUndef( item ){
        ClientsRecords.fieldSet.get().names().forEach(( it ) => {
            if( !Object.keys( item ).includes( it )){
                item[it] = undefined;
            }
        });
        return item;
    },

    /*
    * @param {Object} selector
    * @param {String} userId
     * @param {Object} opts an optional options object with following keys:
     *  - from: the organization identifier for an external identity
    * @returns {Array} may be empty
    */
    async getBy( selector, userId, opts={} ){
        assert( selector && _.isObject( selector ), 'expects an object, got '+selector );
        assert( !userId || _.isString( userId ), 'expects a string or null, got '+userId );
        let scope;
        if( !await Permissions.isAllowed( 'feat.clients.list', userId, scope, opts )){
            return null;
        }
        const res = await ClientsRecords.collection.find( selector ).fetchAsync();
        //console.debug( 'records.getBy', selector, res );
        return res;
    },

    /*
     * @param {String} entityId
     * @param {String} userId
     * @returns {Integer} count of deleted
     */
    async delete( entityId, userId ){
        check( entityId, String );
        check( userId, String );
        //let scope;
        //if( !await Permissions.isAllowed( 'feat.clients.delete', userId, scope )){
        //    return null;
        //}
        const res = await ClientsRecords.collection.removeAsync({ entity: entityId });
        return res;
    },

    /*
    * @summary Create/Update at once an entity and all its validity records
    * @param {Object} entity
    *  an object with a DYN.records array of validity records as ReactiveVar's
    *  we have made sure that even a new entity has its identifier
    *  (but records have not in this case at the moment)
    * @param {String} userId
    * @returns {Object} with following keys:
    */
    async upsert( entity, userId ){
        assert( entity && _.isObject( entity ), 'expect an object, got '+entity );
        assert( !userId || _.isString( userId ), 'expect a string or null, got '+userId );
        //if( !await TenantsManager.isAllowed( 'pwix.tenants_manager.records.fn.upsert', userId, entity )){
        //    return null;
        //}
        //console.debug( 'Records.s.upsert()', entity );
        // get the original item records to be able to detect modifications
        //  and build a hash of id -> record
        const orig = await ClientsRecords.s.getBy({ entity: entity._id }, userId );
        let origIds = {};
        orig.map(( it ) => { origIds[it._id] = it; });
        let leftIds = _.cloneDeep( origIds );
        let updatableIds = {};
        // prepare the result
        let result = {
            orig: orig,
            inserted: 0,
            updated: 0,
            written: [],
            unchanged: [],
            removed: 0,
            count: 0
        };
        // for each provided item, test against the original (if any)
        //  BAD HACK CAUTION: the client has sent (it is expected the client has...) DYN.records as an array of ReactiveVar's
        //  but the class didn't survive the DDP transfert to the server - and so we get here the data members of the class without the functions
        //  so the 'curValue' below
        for( let i=0 ; i<entity.DYN.records.length ; ++i ){
            let record = entity.DYN.records[i].curValue;
            // remove from leftIds the found record
            if( leftIds[record._id] ){
                delete leftIds[record._id];
            }
            // compare and see if the record is to be updated
            if( _.isEqual( record, origIds[record._id] )){
                result.unchanged.push( record );
            } else {
                updatableIds[record._id] = record;
            }
        }
        // for each updatable, then... upsert!
        // as of 2024- 7-17 and matb33:collection-hooks v 2.0.0-rc.1 there is not yet any hook for async methods (though this work at creation)
        let promises = [];
        Object.keys( updatableIds ).forEach(( id ) => {
            const record = updatableIds[id];
            if( record._id ){
                record.updatedBy = userId;
                record.updatedAt = new Date();
            }
            record.entity = entity._id;
            // debug the record content
            //ClientsRecords.collection.upsertAsync({ _id: record._id }, { $set: record });
            promises.push( ClientsRecords.collection.upsertAsync({ _id: record._id }, { $set: record }).then(( res ) => {
                //console.debug( 'upsertAsync', record, 'res', res );
                if( res.numberAffected > 0 ){
                    if( record._id ){
                        result.updated += 1;
                    } else if( res.insertedId ){
                        result.inserted += 1;
                    }
                    result.written.push( record );
                }
                return res;
            }));
        });
        // and remove the left items (removed validity periods)
        Object.keys( leftIds ).forEach(( id ) => {
            promises.push( ClientsRecords.collection.removeAsync({ _id: id }).then(( res ) => {
                result.removed += res || 0;
                return res;
            }));
        });
        return Promise.allSettled( promises ).then(( res ) => {
            return ClientsRecords.collection.countDocuments({ entity: entity._id });
        }).then(() => {
            console.debug( 'ClientsRecords result', result );
            return result;
        });
    }
};
