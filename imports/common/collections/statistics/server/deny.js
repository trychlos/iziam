/*
 * /imports/common/collections/statistics/server/deny.js
 *
 * Statistics from the REST API.
 */

import { Statistics } from '../index.js';

// Deny all client-side updates
// cf. https://guide.meteor.com/security.html#allow-deny

Statistics.collection.deny({
    insert(){ return true; },
    update(){ return true; },
    remove(){ return true; },
});
