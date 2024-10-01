/*
 * /imports/common/collections/clients_entities/server/functions.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
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
    * @returns {Array} may be empty
    */
    async getBy( selector, userId ){
        check( selector, Object );
        check( userId, String );
        let scope;
        if( !await Permissions.isAllowed( 'feat.clients.list', userId, scope )){
            return null;
        }
        const res = await ClientsEntities.collection.find( selector ).fetchAsync();
        //console.debug( 'records', selector, res );
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
        check( entity, Object );
        check( userId, String );
        //if( !await TenantsManager.isAllowed( 'pwix.tenants_manager.entities.fn.upsert', userId, entity )){
        //    return null;
        //}
        let result = {
            orig: null
        };
        let selector = {};
        let item = _.cloneDeep( entity );
        delete item.DYN;
        delete item._id;
        //console.debug( 'item', item );
        // tries to work around "Error: Failed validation Upsert failed after 3 tries."
        if( entity._id ){
            assert( entity.clientId, 'while the client entity exists, it doesn\'have any clientId' );
            result.orig = await ClientsEntities.collection.findOneAsync({ _id: entity._id });
            selector = { _id: entity._id };
            //console.debug( 'selector', selector );
            // Error: After filtering out keys not in the schema, your modifier is now empty
            //  this is normal as long as we do not set any data in the document
            //  so at least set updatedAt here (and even if this will be set another time by timestampable behaviour)
            //item.updatedBy = userId;
            result.numberAfftected = await ClientsEntities.collection.updateAsync( selector, { $set: item }, { filter: false });
        } else {
            assert( !item.clientId, 'while the client entity doesn\'t exist, it does have a non null clientId: '+item.clientId );
            item.clientId = ClientsEntities.s.newId();
            result.insertedId = await ClientsEntities.collection.insertAsync( item );
            result.numberAffected = 1;
            entity.clientId = item.clientId;
            result.clientId = item.clientId;
            entity._id = result.insertedId;
        }
        console.debug( 'ClientsEntities result', result );
        return result;
    }
};
