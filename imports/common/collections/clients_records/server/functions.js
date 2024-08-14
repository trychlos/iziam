/*
 * /imports/collections/clients_records/server/functions.js
 */

import _ from 'lodash';

import { check } from 'meteor/check';
import { Permissions } from 'meteor/pwix:permissions';
import { Random } from 'meteor/random';

import { ClientsRecords } from '../index.js';

ClientsRecords.server = {
    /*
    * @param {Object} selector
    * @param {String} userId
    * @returns {Array} may be empty
    */
    async getBy( selector, userId ){
        check( selector, Object );
        check( userId, String );
        let scope;
        if( !await Permissions.isAllowed( 'feat.clients.fn.get_by', userId, scope )){
            return null;
        }
        const res = await ClientsRecords.collection.find( selector ).fetchAsync();
        //console.debug( 'records', selector, res );
        return res;
    },

    /*
    // return a client by its name
    byName( name ){
        return Clients.findOne({ name: name });
    },


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

    // itemsArray is the array of all the validity records for the upserted entity
    //  there is at least one item
    // @returns {Object} with full result
    // @throws {Error}
    upsert( itemsArray, userId ){
        //console.debug( 'Clients.s.upsert()', itemsArray );
        // search for an entity
        //  the Validity class takes care of cloning records, so if entity is not in the first, it is expected to be nowhere and this is considered as a new object
        let entity = itemsArray[0].entity || null;
        for( let i=1 ; i<itemsArray.length ; ++i ){
            if(( entity && itemsArray[i].entity !== entity ) || ( !entity && itemsArray[i].entity )){
                throw new Error( 'entity is not the same between all records' );
            }
        }
        // get the original item records to be able to detect modifications
        let group = null;
        if( entity ){
            group = Clients.find({ entity: entity }).fetch() || null;
        } else {
            entity = Random.id();
        }
        // prepare the result
        let result = {
            orig: _.cloneDeep( group ),
            group: group,
            entity: entity,
            itemsArray: itemsArray,
            written: [],
            inserted: 0,
            updated: 0,
            ignored: 0,
            removed: 0
        };
        // for each provided item, test against the original (if any)
        for( let i=0 ; i<itemsArray.length ; ++i ){
            let item = _.cloneDeep( itemsArray[i] );
            const $unset = Meteor.APP.Helpers.removeUnsetValues( item );
            let orig = null;
            if( group ){
                for( let j=0 ; j<group.length ; ++j ){
                    if( group[j]._id === item._id ){
                        orig = group.splice( j, 1 )[0];
                        break;
                    }
                }
            }
            //console.debug( 'i='+i, 'found orig', orig );
            // if we have found an original record, then only update it if it has been modified
            let writable = true;
            if( orig ){
                if( _.isEqual( item, orig )){
                    writable = false;
                }
            } else {
                delete item._id;
            }
            //console.debug( 'i='+i, 'writable='+writable );
            if( writable ){
                if( !group ){
                    item.entity = entity;
                    item.clientId = Meteor.APP.Helpers.newId();
                }
                //console.debug( 'upserting', item, 'unset', $unset );
                const res = Clients.upsert({ _id: item._id }, { $set: item, $unset: $unset });
                if( res.numberAffected > 0 ){
                    if( item._id ){
                        result.updated += 1;
                    } else if( res.insertedId ){
                        result.inserted += 1;
                    }
                    result.written.push( item );
                }
            } else {
                result.ignored += 1;
            }
        }
        // when we have treated each edited item, we should 'usually' have spliced all original group
        //  but some periods may leave: remove them
        if( group ){
            for( let i=0 ; i<group.length ; ++i ){
                //console.debug( 'removing', group[i] );
                const res = Clients.remove({ _id: group[i]._id });
                result.removed += res || 0;
            }
        } else {
            console.debug( 'group is left empty' );
        }
        // at last, returns actually written records
        result.records = Clients.find({ entity: entity }).fetch();
        //console.debug( result );
        return result;
    }
        */
};
