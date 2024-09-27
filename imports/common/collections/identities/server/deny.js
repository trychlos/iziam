/*
 * /imports/common/collections/identities/server/deny.js
 */

// Deny all client-side updates
// cf. https://guide.meteor.com/security.html#allow-deny

Meteor.APP.AccountsManager.identities.collectionDb().deny({
    insert(){ return true; },
    update(){ return true; },
    remove(){ return true; },
});
