/*
 * /imports/collections/clients_records/server/deny.js
 */

import { ClientsRecords } from '../index.js';

// Deny all client-side updates
// cf. https://guide.meteor.com/security.html#allow-deny

ClientsRecords.collection.deny({
    insert(){ return true; },
    update(){ return true; },
    remove(){ return true; },
});
