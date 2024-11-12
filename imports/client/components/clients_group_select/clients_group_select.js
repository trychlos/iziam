/*
 * /imports/client/components/clients_group_select/clients_group_select.js
 *
 * Select one clients group.
 * - either by its label
 * - or with a selection tree
 * 
 * Parms:
 * - organization: an entity with its DYN sub-object
 * - selected: the currently selected (clients) group id
 * - disabled: whether this component should be disabled, defaulting to false
 * 
 * Events:
 * - clients-group-selected: the new selected clients group
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Modal } from 'meteor/pwix:modal';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { TenantsManager } from 'meteor/pwix:tenants-manager';

import { ClientGroupType } from '/imports/common/definitions/client-group-type.def.js';

import '/imports/client/components/group_select_dialog/group_select_dialog.js';

import './clients_group_select.html';

Template.clients_group_select.onCreated( function(){
    const self = this;

    self.APP = {
        organization: new ReactiveVar( null ),
        groups: new ReactiveVar( null ),
        selected: new ReactiveVar( null )
    };

    // address the organization saved entity
    self.autorun(() => {
        const entity = Template.currentData().organization;
        if( entity ){
            self.APP.organization.set( TenantsManager.list.byEntity( entity._id ));
        }
    });

    // address the identities groups
    self.autorun(() => {
        const organization = self.APP.organization.get();
        if( organization ){
            self.APP.groups.set( organization.DYN.clients_groups.get());
        }
    });

    // have the initial selection (if any)
    self.autorun(() => {
        const organization = self.APP.organization.get();
        const selectedId = Template.currentData().selected;
        if( organization && selectedId ){
            self.APP.selected.set( organization.DYN.clients_groups.byId( selectedId ));
        }
    });
});

Template.clients_group_select.onRendered( function(){
    const self = this;

    // track the selection, triggering an event on change
    self.autorun(() => {
        const selected = self.APP.selected.get();
        self.$( '.c-clients-group-select' ).trigger( 'clients-group-selected', { selected: selected });
    });
});

Template.clients_group_select.helpers({
    // whether the input field is disabled ?
    disabled(){
        return this.disabled === true ? 'disabled' : '';
    },

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // the input field is readonly as soon as it is disabled (and vice-versa)
    readonly(){
        return this.disabled === true ? 'readonly' : '';
    }
});

Template.clients_group_select.events({
    'click .js-tree'( event, instance ){
        Modal.run({
            groupsRv: instance.APP.groups,
            groupsDef: ClientGroupType,
            selectedRv: instance.APP.selected,
            mdBody: 'group_select_dialog',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-lg',
            //mdClassesContent: Meteor.APP.runContext.pageUIClasses().join( ' ' ),
            mdTitle: pwixI18n.label( I18N, 'clients_groups.select.dialog_title' )
        });
    }
});
