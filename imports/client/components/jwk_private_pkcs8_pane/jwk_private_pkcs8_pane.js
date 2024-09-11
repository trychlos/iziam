/*
 * /imports/client/components/jwk_private_pkcs8_pane/jwk_private_pkcs8_pane.js
 *
 * Display the symmetric secret object
 *
 * Parms:
 * - organization: an { entity, record } organization object
 * - checker: a ReactiveVar which holds the parent Checker
 * - item: a ReactiveVar which contains the JWK item to be edited here
 */

import _ from 'lodash';

import './jwk_private_pkcs8_pane.html';

Template.jwk_private_pkcs8_pane.helpers({
    treeified(){
        return this.item.get().pair.private.pkcs8;
    }
});
