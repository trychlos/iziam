/*
 * /import/common/tables/client_secrets/server/functions.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import { createHash, randomBytes } from 'crypto';

import { ClientSecrets } from '../index.js';

ClientSecrets.s = {
    /**
     * @locus Server
     * @summary Generate a secret and a hash
     * @param {Object} item the current secret item
     * @param {String} userId the current user identifier
     * @returns {Object} this same item
     */
    async generateSecret( item, userId ){
        item.secret = randomBytes( item.size ).toString( 'base64' );
        item.hash = createHash( item.alg ).update( item.secret ).digest( item.encoding );
        item.createdAt = new Date();
        item.createdBy = userId;
        return item;
    }
};
