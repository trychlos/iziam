/*
 * /import/common/tables/jwks/server/functions.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import * as jose from 'jose';

import { JwaAlg } from '/imports/common/definitions/jwa-alg.def.js';

import { Jwks } from '../index.js';

Jwks.s = {
    /**
     * @locus Server
     * @summary Generate the symmetric secret / asymmetric keys pair when creating a new JWK
     * @param {Object<JWK>} item the just defined JWK item
     * @returns {Object<JWK>} this same item
     *  NB: jose works a lot better when running inside of a Web Crypto API runtime, i.e. client-side
     */
    async generateKeys( item ){
        if( Meteor.isServer ){
        }
        return item;
    }
};
