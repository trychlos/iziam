/*
 * /imports/client/components/jwk_private_pkcs8_pane/jwk_private_pkcs8_pane.js
 *
 * Display the symmetric secret object
 *
 * Parms:
 * - container: an { entity, record } organization/client object
 * - checker: a ReactiveVar which holds the parent Checker
 * - item: a ReactiveVar which contains the JWK item to be edited here
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import './jwk_private_pkcs8_pane.html';

Template.jwk_private_pkcs8_pane.helpers({
    treeified(){
        const item = this.item.get();
        return item.pair ? item.pair.private.pkcs8 : null;
    }
});
