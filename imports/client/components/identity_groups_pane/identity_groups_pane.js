/*
 * /imports/client/components/identity_groups_pane/identity_groups_pane.js
 *
 * Identity groups pane.
 * 
 * Parms:
 * - item: a ReactiveVar which holds the identity object to edit (may be empty, but not null)
 * - checker: a ReactiveVar which holds the parent Checker
 * - amInstance: a ReactiveVar which holds the amClass instance
 * - organization: an { entity , record } organization object
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';
import { Random } from 'meteor/random';
import { ReactiveVar } from 'meteor/reactive-var';

import { Organizations } from '/imports/common/collections/organizations/index.js';

import '/imports/client/components/groups_select/groups_select.js';

import './identity_groups_pane.html';

Template.identity_groups_pane.onCreated( function(){
    const self = this;
    console.debug( this );
});

Template.identity_groups_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // groups addresses list
    parmsGroupsSelect(){
        return this;
    }
});

Template.identity_groups_pane.events({
    'click .c-identity-groups-pane .js-plus'( event, instance ){
    }
});
