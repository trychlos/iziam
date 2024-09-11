/*
 * /imports/client/components/jwk_public_jwk_pane/jwk_public_jwk_pane.js
 *
 * Display the symmetric secret object
 *
 * Parms:
 * - organization: an { entity, record } organization object
 * - checker: a ReactiveVar which holds the parent Checker
 * - item: a ReactiveVar which contains the JWK item to be edited here
 */

import _ from 'lodash';
import treeify from 'treeify';

import './jwk_public_jwk_pane.html';

Template.jwk_public_jwk_pane.helpers({
    treeified(){
        return treeify.asTree( this.item.get().pair.public.jwk, true, true );
    }
});
