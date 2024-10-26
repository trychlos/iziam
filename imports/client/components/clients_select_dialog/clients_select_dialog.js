/*
 * /imports/client/components/clients_select_dialog/clients_select_dialog.js
 *
 * Select zero to n clients.
 * 
 * Parms:
 * - organization: the Organization as an entity with its DYN.records array
 * - selected: the currently selected clients group items (for the current group)
 * - disabled: whether this component should be disabled, defaulting to false
 * - selectOptions: additional configuration options for multiple-select component
 * - selectTarget: the jQuery object which will receive the selected result of the dialog
 * 
 * Events:
 * - clients-validated: the new selected clients items, re-triggered each time the selection changes, with data:
 *   > selected: an array of selected ids
 *   > items: an array of selected clients
 */

import _ from 'lodash';

import { Modal } from 'meteor/pwix:modal';
import { ReactiveVar } from 'meteor/reactive-var';
import { TenantsManager } from 'meteor/pwix:tenants-manager';

import { Clients } from '/imports/common/collections/clients/index.js';

import '/imports/client/components/clients_select/clients_select.js';

import './clients_select_dialog.html';

Template.clients_select_dialog.onCreated( function(){
    const self = this;

    self.APP = {
        isModal: new ReactiveVar( false ),
        // all the clients
        clientsRegistrar: new ReactiveVar( null ),
        clients: new ReactiveVar( {} ),
        // the jQuery target of the result of this dialog
        $target: new ReactiveVar( null ),
        // the last received selection
        lastSelected: null
    };

    // get the clients registrar
    self.autorun(() => {
        const organization = TenantsManager.list.byEntity( Template.currentData().organization._id );
        if( organization ){
            self.APP.clientsRegistrar.set( organization.DYN.clients );
        }
    });

    // get and sort all the clients
    self.autorun(() => {
        const registrar = self.APP.clientsRegistrar.get();
        if( registrar ){
            const clients = registrar.get().sort(( a, b ) => {
                if( !a.DYN.label ){
                    a.DYN.label = Identities.fn.bestLabel( a );
                }
                if( !b.DYN.label ){
                    b.DYN.label = Identities.fn.bestLabel( b );
                }
                return a.DYN.label > b.DYN.label ? 1 : ( a.DYN.label < b.DYN.label ? -1 : 0 );
            });
            const hash = {};
            clients.map(( it ) => {
                hash[it._id] = it;
            });
            self.APP.clients.set( hash );
        }
    });

    // get an additional target (if any)
    self.autorun(() => {
        self.APP.$target.set( Template.currentData().selectTarget );
    });
});

Template.clients_select_dialog.onRendered( function(){
    const self = this;

    // whether we are running inside of a Modal
    self.autorun(() => {
        self.APP.isModal.set( self.$( '.c-clients-select-dialog' ).parent().hasClass( 'modal-body' ));
    });

    // set the modal target
    self.autorun(() => {
        if( self.APP.isModal.get()){
            Modal.set({
                target: self.$( '.c-clients-select-dialog' )
            });
        }
    });
});

Template.clients_select_dialog.helpers({
    // parms for the clients_select component
    parmsIdentitiesSelect(){
        return {
            organization: this.organization,
            clients: Object.values( Template.instance().APP.clients.get()),
            selected: this.selected,
            disabled: this.disabled,
            selectOptions: this.selectOptions
        };
    }
});

Template.clients_select_dialog.events({
    // new clients selection
    'clients-selected .c-clients-select-dialog'( event, instance, data ){
        instance.APP.lastSelected = data;
    },

    // submit
    //  event triggered in case of a modal
    'md-click .c-clients-select-dialog'( event, instance, data ){
        //console.debug( event, data );
        if( data.button.id === Modal.C.Button.OK ){
            instance.$( event.currentTarget ).trigger( 'iz-submit' );
        }
    },

    // submit
    // just close
    'iz-submit .c-clients-select-dialog'( event, instance ){
        const closeFn = function(){
            if( instance.APP.isModal.get()){
                Modal.close();
            }
        }
        const $target = instance.APP.$target.get();
        if( $target ){
            $target.trigger( 'clients-validated', instance.APP.lastSelected );
        }
        closeFn();
    }
});
