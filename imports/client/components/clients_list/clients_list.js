/*
 * /imports/client/components/clients_list/clients_list.js
 *
 * Display the clients of an organization.
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization as an entity with its DYN.records array
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - entityTabs
 * - recordTabs
 */

import { Permissions } from 'meteor/pwix:permissions';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tolert } from 'meteor/pwix:tolert';

import '/imports/client/components/client_edit_dialog/client_edit_dialog.js';

import './clients_list.html';

Template.clients_list.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        handleOne: self.subscribe( Meteor.APP.C.pub.clientsTabularOne.publish, Template.currentData().item.get()._id || null ),
        resultOne: new ReactiveVar( [] ),
        handleTwo: null,
        closests: new ReactiveVar( [] ),
        handleAll: null,
        clientsAll: new ReactiveVar( [] ),

        // returns the asked entity
        byEntity( entity ){
            let found = null;
            self.APP.clientsAll.get().every(( it ) => {
                if( it._id === entity ){
                    found = it;
                }
                return !found;
            });
            return found;
        }
    };

    // get the result of the first one
    self.autorun(() => {
        if( self.APP.handleOne.ready()){
            Meteor.APP.Collections.get( Meteor.APP.C.pub.clientsTabularOne.collection ).find().fetchAsync().then(( fetched ) => {
                self.APP.resultOne.set( fetched );
            });
        }
    });

    // subscribe to the two other publications with this result
    self.autorun(() => {
        self.APP.handleTwo = self.subscribe( Meteor.APP.C.pub.clientsTabularTwo.publish, Template.currentData().item.get()._id || null, self.APP.resultOne.get());
        self.APP.handleAll = self.subscribe( Meteor.APP.C.pub.clientsAll.publish, Template.currentData().item.get()._id || null, self.APP.resultOne.get());
    });

    // subscribe to the tabular publication to get the list of closest ids
    self.autorun(() => {
        if( self.APP.handleTwo.ready()){
            let closests = [];
            Meteor.APP.Collections.get( Meteor.APP.C.pub.clientsTabularTwo.collection ).find().fetchAsync().then(( fetched ) => {
                fetched.forEach(( it ) => {
                    closests.push( it._id );
                });
                self.APP.closests.set( closests );
            });
        }
    });

    // subscribe to the clientsAll publication to get the full list of clients
    self.autorun(() => {
        if( self.APP.handleAll.ready()){
            let items = [];
            Meteor.APP.Collections.get( Meteor.APP.C.pub.clientsAll.collection ).find().fetchAsync().then(( fetched ) => {
                self.APP.clientsAll.set( fetched );
            });
        }
    });
});

Template.clients_list.helpers({
    // whether the current user has the permission to see the list of clients for the current organization
    canList(){
        const res = Permissions.isAllowed( 'feat.clients.pub.tabular', this.item.get()._id );
        //console.debug( 'res', res );
        return res;
    },

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // a display selector
    selector(){
        const selector = { _id: {}};
        selector._id.$in = Template.instance().APP.closests.get();
        return selector;
    }
});

Template.clients_list.events({
    // delete a client - this will delete all the validity records too
    'tabular-delete-event .c-clients-list'( event, instance, data ){
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
    'tabular-edit-event .c-clients-list'( event, instance, data ){
        let dc = { ...this };
        delete dc.entityTabs;
        delete dc.recordTabs
        delete dc.checker;
        const organization = {
            entity: this.item.get(),
            record: this.item.get().DYN.closest
        };
        const item = instance.APP.byEntity( data.item._id );
        Modal.run({
            ...dc,
            mdBody: 'client_edit_dialog',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-xxl',
            //mdClassesContent: Meteor.APP.runContext.pageUIClasses().join( ' ' ),
            mdTitle: pwixI18n.label( I18N, 'clients.edit.modal_title', item.DYN.closest.label ),
            item: item,
            organization: organization
        });
        return false;
    }
});