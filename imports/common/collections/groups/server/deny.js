/*
 * /imports/common/collections/groups/server/deny.js
 */

import { Groups } from '../index.js';

// Deny all client-side updates
// cf. https://guide.meteor.com/security.html#allow-deny

Groups.collection.deny({
    insert(){ return true; },
    update(){ return true; },
    remove(){ return true; },
});
