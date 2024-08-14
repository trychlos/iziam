/*
 * /imports/client/components/organization_clients_pane/organization_clients_pane.js
 *
 * Display the clients.
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - entityTabs
 * - recordTabs
 */

import { Permissions } from 'meteor/pwix:permissions';
import { pwixI18n } from 'meteor/pwix:i18n';
import { Tolert } from 'meteor/pwix:tolert';

import { Clients } from '/imports/common/collections/clients/index.js';

import '../client_new_button/client_new_button.js';

import './organization_clients_pane.html';

Template.organization_clients_pane.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        closests: new ReactiveVar( [] ),
        handle: self.subscribe( Meteor.APP.C.pub.closests.publish )
    };

    // subscribe to the ad-hoc publication to get the list of closest ids
    self.autorun(() => {
        if( self.APP.handle.ready()){
            let closests = [];
            Meteor.APP.Collections.get( Meteor.APP.C.pub.closests.collection ).find().fetchAsync().then(( fetched ) => {
                fetched.forEach(( it ) => {
                    closests.push( it._id );
                });
                self.APP.closests.set( closests );
            });
        }
    });
});

Template.organization_clients_pane.helpers({
    // whether the current user has the permission to see the list of clients for the current organization
    canList(){
        const res = Permissions.isAllowed( 'feat.clients.pub.list_all', this.item.get()._id );
        //console.debug( 'res', res );
        return res;
    },

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // client new button parameters
    parmsNew(){
        return {
            ...this,
            label: pwixI18n.label( I18N, 'clients.new.button_label' ),
            shape: PlusButton.C.Shape.RECTANGLE,
            title: pwixI18n.label( I18N, 'clients.new.button_title' )
        }
    },

    // a display selector
    selector(){
        const selector = { _id: {}};
        selector._id.$in = Template.instance().APP.closests.get();
        return selector;
    }
});

Template.organization_clients_pane.events({
    // delete a client - this will delete all the validity records too
    'tabular-delete-event .c-organization-clients-pane'( event, instance, data ){
        const label = data.item.label;
        Meteor.callAsync( 'clients_delete', data.item.entity )
            .then(( res ) => {
                console.debug( res );
                Tolert.success( pwixI18n.label( I18N, 'delete.success', label ));
            })
            .catch(( e ) => {
                Tolert.error({ type:e.error, message:e.reason });
            });
        return false; // doesn't propagate
    },

    // edit a client
    //  the buttons from tabular provide the entity document
    'tabular-edit-event .c-organization-clients-pane'( event, instance, data ){
        /*
        Modal.run({
            ...this,
            mdBody: 'client_edit',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-xl',
            mdClassesContent: Meteor.APP.configure().classes,
            mdTitle: pwixI18n.label( I18N, 'edit.modal_title' ),
            item: Meteor.APP.list.byEntity( data.item._id )
        });
        */
        return false;
    }
});
