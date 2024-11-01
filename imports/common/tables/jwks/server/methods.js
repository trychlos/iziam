/*
 * /imports/common/tables/jwks/server/methods.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Jwks } from '../index.js';

Meteor.methods({
    'jwks_generate_keys'( item ){
        return Jwks.s.generateKeys( item, this.userId );
    }
});
