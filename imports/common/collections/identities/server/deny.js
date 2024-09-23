/*
 * /imports/common/collections/identities/server/deny.js
 */

import { Identities } from '../index.js';

// Deny all client-side updates
// cf. https://guide.meteor.com/security.html#allow-deny

Identities.collection?.deny({
    insert(){ return true; },
    update(){ return true; },
    remove(){ return true; },
});
