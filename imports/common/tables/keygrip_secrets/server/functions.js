/*
 * /import/common/tables/keygrip_secrets/server/functions.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import { createHash, randomBytes } from 'crypto';

import { KeygripSecrets } from '../index.js';

KeygripSecrets.s = {
    /**
     * @locus Server
     * @summary Generate the a secret and a hash for a keygrip
     * @param {Object<Keygrip>} item the current keygrip item
     * @returns {Object} a { secret, hash } object
     */
    async generateSecret( item ){
        const secret = randomBytes( item.size ).toString( 'base64' );
        const hash = createHash( item.alg ).update( secret ).digest( item.encoding );
        //console.debug( 'returning', secret, hash );
        return {
            secret: secret,
            hash: hash
        };
    }
};
