/*
 * /import/common/tables/client_secrets/server/functions.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
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
        item.hex = randomBytes( item.size ).toString( Meteor.APP.C.secretDefEncoding );
        item.createdAt = new Date();
        item.createdBy = userId;
        return item;
    }
};
