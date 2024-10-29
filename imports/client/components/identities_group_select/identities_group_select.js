/*
 * /imports/client/components/identities_group_select/identities_group_select.js
 *
 * Select one identities group.
 * - either by its label
 * - or with a selection tree
 * 
 * Parms:
 * - organization: an entity with its DYN sub-object
 * - groups: the groups
 * - selected: the currently selected (identities) group id
 * - disabled: whether this component should be disabled, defaulting to false
 * 
 * Events:
 * - identities-group-selected: the new selected identities group
 */

import _ from 'lodash';

import { Modal } from 'meteor/pwix:modal';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import { IdentityGroupType } from '/imports/common/definitions/identity-group-type.def.js';

import '/imports/client/components/group_select_dialog/group_select_dialog.js';

import './identities_group_select.html';

Template.identities_group_select.onCreated( function(){
    const self = this;

    self.APP = {
        selected: new ReactiveVar( null )
    };
});

Template.identities_group_select.onRendered( function(){
    const self = this;

    // track the selection, triggering an event on change
    self.autorun(() => {
        const selected = self.APP.selected.get();
        self.$( '.c-identities-group-select' ).trigger( 'identities-group-selected', { selected: selected });
    });

    // setup the selected label (if any)
    self.autorun(() => {
        const selected = Template.currentData().selected;
        if( selected ){
            Meteor.callAsync( 'identities_groups.getBy', Template.currentData().organization._id, { _id: selected }).then(( res ) => {
                if( res && res.length ){
                    self.APP.selected.set( res[0] );
                } else {
                    console.warn( 'IdentitiesGroups not found', selected );
                }
            });
        }
    });
});

Template.identities_group_select.helpers({
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

Template.identities_group_select.events({
    'click .js-tree'( event, instance ){
        Modal.run({
            ...this,
            groupTypeDef: IdentityGroupType,
            withIdentities: false,
            selectedRv: instance.APP.selected,
            mdBody: 'group_select_dialog',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-lg',
            //mdClassesContent: Meteor.APP.runContext.pageUIClasses().join( ' ' ),
            mdTitle: pwixI18n.label( I18N, 'identities_groups.select.dialog_title' )
        });
    }
});
