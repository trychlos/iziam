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
     * @returns {Object} a { secret, hash } object
     */
    async generateSecret( item ){
        const clear = randomBytes( item.size ).toString( 'base64' );
        const hash = createHash( item.alg ).update( clear ).digest( item.encoding );
        //console.debug( 'returning', secret, hash );
        return {
            clear: clear,
            hash: hash
        };
    }
};
