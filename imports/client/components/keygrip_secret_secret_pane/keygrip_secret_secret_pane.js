/*
 * /imports/client/components/keygrip_secret_secret_pane/keygrip_secret_secret_pane.js
 *
 * Display the secret and the corresponding hash
 *
 * Parms:
 * - container: an { entity, record } organization/client object
 * - checker: a ReactiveVar which holds the parent Checker
 * - item: a ReactiveVar which contains the key item to be edited here
 * - isNew: a ReactiveVar which contains a boolean 'isNew' flag
 * - keygripRv: a ReactiveVar which contains the current keygrip item
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import './keygrip_secret_secret_pane.html';

Template.keygrip_secret_secret_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    treeifiedHash(){
        const item = this.item.get();
        return item.secret || null;
    },

    treeifiedSecret(){
        const item = this.item.get();
        return item.hash || null;
    }
});
