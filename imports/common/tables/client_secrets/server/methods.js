/*
 * /imports/common/tables/client_secrets/server/methods.js
 */

import { ClientSecrets } from '../index.js';

Meteor.methods({
    'client_generate_secret'( item ){
        return ClientSecrets.s.generateSecret( item, this.userId );
    }
});
