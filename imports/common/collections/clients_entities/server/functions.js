/*
 * /imports/collections/clients_entities/server/functions.js
 */

import _ from 'lodash';

import { Random } from 'meteor/random';

import { ClientsEntities } from '../index.js';

ClientsEntities.server = {
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
        const res = await ClientsEntities.collection.find( selector ).fetchAsync();
        //console.debug( 'records', selector, res );
        return res;
    }
};
