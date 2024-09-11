/*
 * /imports/client/components/jwk_secret_pane/jwk_secret_pane.js
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

import './jwk_secret_pane.html';

Template.jwk_secret_pane.helpers({
    treeified(){
        return treeify.asTree( this.item.get().secret, true, true );
    }
});
