/*
 * /imports/client/components/jwk_private_jwk_pane/jwk_private_jwk_pane.js
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
import treeify from 'treeify';

import './jwk_private_jwk_pane.html';

Template.jwk_private_jwk_pane.helpers({
    treeified(){
        const item = this.item.get();
        return item.pair ? treeify.asTree( item.pair.private.jwk, true, true ) : null;
    }
});
