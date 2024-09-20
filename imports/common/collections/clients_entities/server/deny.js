/*
 * /imports/common/collections/clients_entities/server/deny.js
 */

import { ClientsEntities } from '../index.js';

// Deny all client-side updates
// cf. https://guide.meteor.com/security.html#allow-deny

ClientsEntities.collection.deny({
    insert(){ return true; },
    update(){ return true; },
    remove(){ return true; },
});
