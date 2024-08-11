/*
 * /imports/collections/clients_entities/server/functions.js
 */

import _ from 'lodash';

import { Random } from 'meteor/random';

import { ClientsEntities } from '../index.js';

ClientEntities.s = {
    // returns the queried items
    async getBy( query ){
        let res = ClientsEntities.find( query ).fetchAsync();
        //console.log( 'ClientEntities.s.getBy', query, res );
        return res;
    },
};
