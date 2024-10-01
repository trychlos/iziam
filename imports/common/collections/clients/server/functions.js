/*
 * /imports/common/collections/clients/server/functions.js
 */

import _ from 'lodash';

import { Validity } from 'meteor/pwix:validity';

import { Clients } from '../index.js';

import { ClientsEntities} from '/imports/common/collections/clients_entities/index.js';
import { ClientsRecords} from '/imports/common/collections/clients_records/index.js';

Clients.s = {
    /**
     * @summary Make sure all the fields of the fieldset are set in the item, even if undefined
     * @param {Object} item
     * @returns {Object} item
     */
    addUndef( item ){
        Clients.fieldSet.get().names().forEach(( it ) => {
            if( !Object.keys( item ).includes( it )){
                item[it] = undefined;
            }
        });
        return item;
    },

    // return a client by its oauth client_id
    // returns a { entity, record } client object valid at date, or null
    async byClientIdAtDate( clientId ){
        let result = null;
        const entities = await ClientsEntities.collection.find({ clientId: clientId }).fetchAsync();
        if( entities.length === 1 ){
            const records = await ClientsRecords.collection.find({ entity: entities[0]._id }).fetchAsync();
            if( records.length > 0 ){
                const atdate = Validity.atDateByRecords( records );
                if( atdate ){
                    result = { entity: entities[0], record: atdate };
                }
            }
        }
        return result;
    },

    /*
    // update (actually replace) the data provided via the FormChecker fields
    updateByFields( item, fields, userId ){
        let set = {};
        Object.keys( fields ).every(( f ) => {
            //console.debug( f, item[f] );
            set[f] = item[f];
            return true;
        })
        const res = Clients.update({ _id: item._id }, { $set: set });
        return res;
    },
    */

    // entity is the client entity with a DYN.records array of ReactiveVar's
    //  there is at least one item
    // @returns {Object} with full result
    // @throws {Error}
    async upsert( entity, userId ){
        check( entity, Object );
        check( userId, String );
        //if( !await TenantsManager.isAllowed( 'pwix.tenants_manager.fn.upsert', userId, entity )){
        //    return null;
        //}
        //console.debug( 'Clients.s.upsert()', entity );
    
        // upsert the entity
        //  we get back not only a result but also the original entity
        //  when new, 'entity' has been updated with newly inserted id
        let entitiesRes = await ClientsEntities.s.upsert( entity, userId );
    
        // and asks the Records to do the rest
        let recordsRes = await ClientsRecords.s.upsert( entity, userId );
    
        return {
            entities: entitiesRes,
            records: recordsRes
        }
    }
};
