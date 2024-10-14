/*
 * /imports/group/components/groups_buttons/groups_buttons.js
 *
 * The buttons to edit the groups tree.
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization as an entity with its DYN.records array
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - groups: a ReactiveVar which contains the groups of the organization
 * - editable: whether the tree is editable, defaulting to true
 * - editEnabled: the enable/disable state of the Edit button, defaulting to true
 * - removeEnabled: the enable/disable state of the Delete button, defaulting to true
 * - addEnabled: the enable/disable state of the Add identities button, defaulting to true
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

import './groups_buttons.html';

Template.groups_buttons.onCreated( function(){
    const self = this;
    //console.debug( this );
});

Template.groups_buttons.helpers({
    // whether the Add identities button is enabled ?
    addDisabled(){
        return this.addEnabled !== false ? '' : 'disabled';
    },

    // whether the Delete button is enabled ?
    deleteDisabled(){
        return this.deleteEnabled !== false ? '' : 'disabled';
    },

    // whether the Edit button is enabled ?
    editDisabled(){
        return this.editEnabled !== false ? '' : 'disabled';
    },

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // whether the tree is editable
    isEditable(){
        return this.editable !== false;
    },

    // whether the Remove button is enabled ?
    removeDisabled(){
        return this.removeEnabled !== false ? '' : 'disabled';
    }
});

Template.groups_buttons.events({
});