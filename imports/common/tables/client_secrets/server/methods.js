/*
 * /imports/common/tables/client_secrets/server/methods.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { ClientSecrets } from '../index.js';

Meteor.methods({
    'client_generate_secret'( item ){
        return ClientSecrets.s.generateSecret( item, this.userId );
    }
});
