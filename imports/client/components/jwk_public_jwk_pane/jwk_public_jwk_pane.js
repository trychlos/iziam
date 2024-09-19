/*
 * /imports/client/components/jwk_public_jwk_pane/jwk_public_jwk_pane.js
 *
 * Display the symmetric secret object
 *
 * Parms:
 * - container: an { entity, record } organization/client object
 * - checker: a ReactiveVar which holds the parent Checker
 * - item: a ReactiveVar which contains the JWK item to be edited here
 */

import _ from 'lodash';
import treeify from 'treeify';

import './jwk_public_jwk_pane.html';

Template.jwk_public_jwk_pane.helpers({
    treeified(){
        const item = this.item.get();
        return item.pair ? treeify.asTree( item.pair.public.jwk, true, true ) : null;
    }
});
