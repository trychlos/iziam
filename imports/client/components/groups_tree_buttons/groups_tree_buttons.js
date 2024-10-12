/*
 * /imports/group/components/groups_tree_buttons/groups_tree_buttons.js
 *
 * The buttons to edit the groups tree.
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - groups: the list of groups for the organization
 */

import _ from 'lodash';

import { Modal } from 'meteor/pwix:modal';
import { Permissions } from 'meteor/pwix:permissions';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import './groups_tree_buttons.html';

Template.groups_tree_buttons.onCreated( function(){
    const self = this;
    //console.debug( this );
});

Template.groups_tree_buttons.helpers({
});

Template.groups_tree_buttons.events({
});
