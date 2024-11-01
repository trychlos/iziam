/*
 * /import/common/tables/keygrip_secrets/server/functions.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import { createHash, randomBytes } from 'crypto';

import { KeygripSecrets } from '../index.js';

KeygripSecrets.s = {
    /**
     * @locus Server
     * @summary Generate the a secret and a hash for a keygrip
     * @param {Object<Keygrip>} item the current keygrip item
     * @param {Object} key the current key to be updated
     * @param {String} userId the current user identifier
     * @returns {Object} this same key object with its secret, hash data
     */
    async generateSecret( item, key, userId ){
        key.secret = randomBytes( item.size ).toString( 'base64' );
        key.hash = createHash( item.alg ).update( key.secret ).digest( item.encoding );
        key.createdAt = new Date();
        key.createdBy = userId;
        return key;
    }
};
