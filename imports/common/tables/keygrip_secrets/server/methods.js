/*
 * /imports/common/tables/keygrip_secrets/server/methods.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { KeygripSecrets } from '../index.js';

Meteor.methods({
    'keygrip_generate_secret'( item, key ){
        return KeygripSecrets.s.generateSecret( item, key, this.userId );
    }
});
