/*
 * /imports/client/components/identity_groups_pane/identity_groups_pane.js
 *
 * Identity groups pane.
 * 
 * Parms:
 * - item: a ReactiveVar which holds the identity object to edit (may be empty, but not null)
 * - checker: a ReactiveVar which holds the parent Checker
 * - amInstance: a ReactiveVar which holds the amClass instance
 * - organization: the Organization as an entity with its DYN.records array
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import '/imports/client/components/identity_groups_select_tree/identity_groups_select_tree.js';

import './identity_groups_pane.html';

Template.identity_groups_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // groups list
    parmsGroupsSelect(){
        return this;
    }
});
