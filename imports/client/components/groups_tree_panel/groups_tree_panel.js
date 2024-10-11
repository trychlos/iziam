/*
 * /imports/group/components/groups_tree_panel/groups_tree_panel.js
 *
 * Let the organization manager define a new group.
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - plus all plusButton parameters will be passed through
 */

import _ from 'lodash';

import { Modal } from 'meteor/pwix:modal';
import { Permissions } from 'meteor/pwix:permissions';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import './groups_tree_panel.html';

Template.groups_tree_panel.onCreated( function(){
    const self = this;
    //console.debug( this );
});

Template.groups_tree_panel.helpers({
});

Template.groups_tree_panel.events({
});
