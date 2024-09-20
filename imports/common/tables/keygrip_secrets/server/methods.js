/*
 * /imports/common/tables/keygrip_secrets/server/methods.js
 */

import { KeygripSecrets } from '../index.js';

Meteor.methods({
    'keygrip_generate_secret'( item ){
        return KeygripSecrets.s.generateSecret( item, this.userId );
    }
});
