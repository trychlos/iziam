/*
 * /imports/common/collections/clients_entities/server/functions.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import { v4 as uuidv4 } from 'uuid';

import { ClientsEntities } from '../index.js';

ClientsEntities.s = {
    /**
     * @summary Make sure all the fields of the fieldset are set in the item, even if undefined
     * @param {Object} item
     * @returns {Object} item
     */
    addUndef( item ){
        ClientsEntities.fieldSet.get().names().forEach(( it ) => {
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
    async getBy( organizationId, selector, userId, opts={} ){
        assert( selector && _.isObject( selector ), 'expects an object, got '+selector );
        assert( !userId || _.isString( userId ), 'expects a string or null, got '+userId );
        if( !await Permissions.isAllowed( 'feat.clients.list', userId, organizationId, opts )){
            return null;
        }
        const res = await ClientsEntities.collection.find( selector ).fetchAsync();
        //console.debug( 'records', selector, res );
        return res;
    },

    /*
     * @param {String} entityId
     * @param {String} userId
     * @returns {Integer} count of deleted
     */
    async delete( entityId, userId ){
        assert( entityId && _.isString( entityId ), 'expects a string, got '+entityId );
        assert( !userId || _.isString( userId ), 'expects a string or null, got '+userId );
        //let scope;
        //if( !await Permissions.isAllowed( 'feat.clients.delete', userId, scope )){
        //    return null;
        //}
        const res = await ClientsEntities.collection.removeAsync({ _id: entityId });
        return res;
    },

    /**
     * https://datatracker.ietf.org/doc/html/rfc6749#section-2.2 - Client Identifier
     *  The authorization server issues the registered client a client dentifier -- a unique string representing the registration information provided
     *  by the client.  The client identifier is not a secret; it is exposed to the resource owner and MUST NOT be used alone for client authentication.
     *  The client identifier is unique to the authorization server.
     *
     *  The client identifier string size is left undefined by this specification.  The client should avoid making assumptions about the identifier size.
     *  The authorization server SHOULD document the size of any identifier it issues.
     * 
     * https://www.oauth.com/oauth2-servers/client-registration/client-id-secret/
     *  Examples of client_id:
     *  Foursquare: ZYDPLLBWSK3MVQJSIYHB1OR2JXCY0X2C5UJ2QAR2MAAIT5Q
     *  Github: 6779ef20e75817b79602
     *  Google: 292085223830.apps.googleusercontent.com
     *  Instagram: f2a1ed52710d4533bde25be6da03b6e3
     *  SoundCloud: 269d98e4922fb3895e9ae2108cbb5064
     *  Windows Live: 00000000400ECB04
     *  Okta: 0oa2hl2inow5Uqc6c357
     * 
     *  izIAM: 7a15a901ade649a2af1cbd06a97df4eb
     *@returns {String} a new identifier
     */
    newId(){
        return uuidv4().replace( /-/g, '' );
    },

    /*
    * @summary Create/Update at once an entity and all its validity records
    * @param {Object} entity
    *  an object with a DYN.records array of validity records as ReactiveVar's
    * @param {String} userId
    * @returns {Object} with following keys:
    *  - numberAffected
    *  - insertedId, if the entity was just newly inserted
    *  - orig, the value before upsert
    */
    async upsert( entity, userId ){
        assert( entity && _.isObject( entity ), 'expect an entity object, got '+entity );
        assert( userId && _.isString( userId ), 'expect a non-null string, got '+userId );
        if( !await Permissions.isAllowed( 'feat.clients.create', userId, entity )){
            return null;
        }
        let result = {};
        result.orig = null;
        const entityId = entity._id;
        if( entityId ){
            result.orig = await ClientsEntities.collection.findOneAsync({ _id: entityId });
        }
        const DYN = entity.DYN;
        delete entity.DYN;
        if( !entity.clientId ){
            entity.clientId = ClientsEntities.s.newId();
            result.clientId = entity.clientId;
        }
        if( entityId ){
            result.numberAffected = await ClientsEntities.collection.updateAsync({ _id: entityId }, { $set: entity });
            entity._id = entityId;
        } else {
            result.insertedId = await ClientsEntities.collection.insertAsync( entity );
            result.numberAffected = 1;
            entity._id = result.insertedId;
        }
        //const res = await ClientsEntities.collection.upsertAsync({ _id: entity._id }, { $set: entity });
        entity.DYN = DYN;
        //if( res.insertedId ){
        //    result.insertedId = res.insertedId;
        //    entity._id = res.insertedId;
        //}
        //result.numberAffected = res.numberAffected;
        //console.debug( 'ClientsEntities res', res, 'entity', entity );
        console.debug( 'ClientsEntities result', result );
        return result;
    }
};
