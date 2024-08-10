/*
 * /imports/collections/clients/server/deny.js
 */

import { Clients } from '../index.js';

// Deny all client-side updates
// cf. https://guide.meteor.com/security.html#allow-deny

Clients.deny({
    insert(){ return true; },
    update(){ return true; },
    remove(){ return true; },
});
