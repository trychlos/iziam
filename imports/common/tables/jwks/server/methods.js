/*
 * /imports/common/tables/jwks/server/methods.js
 */

import { Jwks } from '../index.js';

Meteor.methods({
    'jwks_generate_keys'( item ){
        return Jwks.s.generateKeys( item, this.userId );
    }
});
