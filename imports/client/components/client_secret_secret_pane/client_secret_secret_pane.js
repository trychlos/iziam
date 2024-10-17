/*
 * /imports/client/components/client_secret_secret_pane/client_secret_secret_pane.js
 *
 * Manage a keygrip secret, maybe empty but have at least an _id.
 *
 * Parms:
 * - container: an { entity, record } organization object
 * - checker: a ReactiveVar which holds the parent Checker
 * - item: a ReactiveVar which contains the keygrip secret item to be edited here
 * - isNew: a ReactiveVar which contains a boolean 'isNew' flag
 * - keygripRv: a ReactiveVar which contains the current keygrip item
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

import './client_secret_secret_pane.html';

Template.client_secret_secret_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    treeifiedSecret(){
        const item = this.item.get();
        return item.hex || null;
    }
});
