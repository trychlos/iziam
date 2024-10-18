/*
 * /imports/client/components/identities_select_dialog/identities_select_dialog.js
 *
 * Select zero to n identities.
 * 
 * Parms:
 * - organization: the Organization as an entity with its DYN.records array
 * - selected: the currently selected identities group items (for the current group)
 * - disabled: whether this component should be disabled, defaulting to false
 * - selectOptions: additional configuration options for multiple-select component
 * - selectTarget: the jQuery object which will receive the selected result of the dialog
 * 
 * Events:
 * - identities-validated: the new selected identities items, re-triggered each time the selection changes, with data:
 *   > selected: an array of selected ids
 *   > items: an array of selected identities
 */

import _ from 'lodash';

import { Modal } from 'meteor/pwix:modal';
import { ReactiveVar } from 'meteor/reactive-var';
import { TenantsManager } from 'meteor/pwix:tenants-manager';

import { Identities } from '/imports/common/collections/identities/index.js';

import '/imports/client/components/identities_select/identities_select.js';

import './identities_select_dialog.html';

Template.identities_select_dialog.onCreated( function(){
    const self = this;

    self.APP = {
        isModal: new ReactiveVar( false ),
        // all the identities
        identitiesRegistrar: new ReactiveVar( null ),
        identities: new ReactiveVar( {} ),
        // the jQuery target of the result of this dialog
        $target: new ReactiveVar( null ),
        // the last received selection
        lastSelected: null
    };

    // get the identities registrar
    self.autorun(() => {
        const organization = TenantsManager.list.byEntity( Template.currentData().organization._id );
        if( organization ){
            self.APP.identitiesRegistrar.set( organization.DYN.identities );
        }
    });

    // get and sort all the identities
    self.autorun(() => {
        const registrar = self.APP.identitiesRegistrar.get();
        if( registrar ){
            const identities = registrar.get().sort(( a, b ) => {
                if( !a.DYN.label ){
                    a.DYN.label = Identities.fn.bestLabel( a );
                }
                if( !b.DYN.label ){
                    b.DYN.label = Identities.fn.bestLabel( b );
                }
                return a.DYN.label > b.DYN.label ? 1 : ( a.DYN.label < b.DYN.label ? -1 : 0 );
            });
            const hash = {};
            identities.map(( it ) => {
                hash[it._id] = it;
            });
            self.APP.identities.set( hash );
        }
    });

    // get an additional target (if any)
    self.autorun(() => {
        self.APP.$target.set( Template.currentData().selectTarget );
    });
});

Template.identities_select_dialog.onRendered( function(){
    const self = this;

    // whether we are running inside of a Modal
    self.autorun(() => {
        self.APP.isModal.set( self.$( '.c-identities-select-dialog' ).parent().hasClass( 'modal-body' ));
    });

    // set the modal target
    self.autorun(() => {
        if( self.APP.isModal.get()){
            Modal.set({
                target: self.$( '.c-identities-select-dialog' )
            });
        }
    });
});

Template.identities_select_dialog.helpers({
    // parms for the identities_select component
    parmsIdentitiesSelect(){
        return {
            organization: this.organization,
            identities: Object.values( Template.instance().APP.identities.get()),
            selected: this.selected,
            disabled: this.disabled,
            selectOptions: this.selectOptions
        };
    }
});

Template.identities_select_dialog.events({
    // new identities selection
    'identities-selected .c-identities-select-dialog'( event, instance, data ){
        instance.APP.lastSelected = data;
    },

    // submit
    //  event triggered in case of a modal
    'md-click .c-identities-select-dialog'( event, instance, data ){
        //console.debug( event, data );
        if( data.button.id === Modal.C.Button.OK ){
            instance.$( event.currentTarget ).trigger( 'iz-submit' );
        }
    },

    // submit
    // just close
    'iz-submit .c-identities-select-dialog'( event, instance ){
        const closeFn = function(){
            if( instance.APP.isModal.get()){
                Modal.close();
            }
        }
        const $target = instance.APP.$target.get();
        if( $target ){
            $target.trigger( 'identities-validated', instance.APP.lastSelected );
        }
        closeFn();
    }
});
