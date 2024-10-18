/*
 * /imports/client/components/client_edit_dialog/client_edit_dialog.js
 *
 * Client editor.
 *
 *  This is the top template of the edition hierarchy for the client:
 *
 *    client_edit_dialog                            this one: manage the events
 *     |
 *     +- Tabbed                                    manage both the entity tabs and the validities
 *     |   |
 *     |   +- client_entity_xxx_pane                (unused)
 *     |   |
 *     |   +- NotesEdit                             client entity notes
 *     |   |
 *     |   +- client_entity_validities_pane
 *     |       |
 *     |       +- ValiditiesTabbed                      manage the validities with one pane per validity period
 *     |           |
 *     |           +- client_record_tabbed              the record edition panel, as a tabbed component
 *     |           |   |
 *     |           |   +- Tabbed
 *     |           |       |
 *     |           |       +- client_properties_panel
 *     |           |       +- client_profile_panel
 *     |           |       +- client_type_panel
 *     |           |       +- client_providers_panel
 *     |           |       +- client_auth_method_panel
 *     |           |       +- client_grant_types_panel
 *     |           |       +- NotesEdit                 record notes
 *     |           |
 *     |           +- ValidityFieldset
 *     |
 *     +- Forms.Messager                            the messages area
 *
 *  This template hierarchy can run inside of a plain page or of a modal; this is up to the caller, and dynamically identified here.
 *
 * Parms:
 * - item: the to-be-edited entity item, null when new
 *      including DYN.managers and DYN.records arrays
 *      this item will be left unchanged until panel submission
 * - organization: the Organization as an entity with its DYN.records array
 */

import _ from 'lodash';

import { Forms } from 'meteor/pwix:forms';
import { Modal } from 'meteor/pwix:modal';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tabbed } from 'meteor/pwix:tabbed';
import { Tolert } from 'meteor/pwix:tolert';
import { Validity } from 'meteor/pwix:validity';

import { ClientsEntities } from '/imports/common/collections/clients_entities/index.js';

import '/imports/client/components/client_application_type_select/client_application_type_select.js';
import '/imports/client/components/client_auth_method_panel/client_auth_method_panel.js';
import '/imports/client/components/client_config_pane/client_config_pane.js';
import '/imports/client/components/client_contacts_panel/client_contacts_panel.js';
import '/imports/client/components/client_entity_properties_pane/client_entity_properties_pane.js';
import '/imports/client/components/client_entity_validities_pane/client_entity_validities_pane.js';
import '/imports/client/components/client_grant_types_panel/client_grant_types_panel.js';
import '/imports/client/components/client_jwks_panel/client_jwks_panel.js';
import '/imports/client/components/client_profile_select/client_profile_select.js';
import '/imports/client/components/client_properties_panel/client_properties_panel.js';
import '/imports/client/components/client_record_tabbed/client_record_tabbed.js';
import '/imports/client/components/client_redirects_panel/client_redirects_panel.js';
import '/imports/client/components/client_secrets_panel/client_secrets_panel.js';
import '/imports/client/components/client_type_select/client_type_select.js';

import './client_edit_dialog.html';

Template.client_edit_dialog.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        // the global Checker for this modal
        checker: new ReactiveVar( null ),
        // the global Message zone for this modal
        messager: new Forms.Messager(),
        // whether the item is a new one ?
        isNew: new ReactiveVar( false ),
        // the item to be edited (a deep copy of the original)
        item: new ReactiveVar( null ),
        // whether we are running inside of a Modal
        isModal: new ReactiveVar( false ),
        // the entity tabbed
        tabbed: new Tabbed.Instance( self, { name: 'client_edit_dialog' })
    };

    // keep the initial 'new' state
    self.autorun(() => {
        self.APP.isNew.set( _.isNil( Template.currentData().item ));
    });

    // setup the item to be edited
    //  we want a clone deep of the provided item, so that we are able to cancel the edition without keeping any sort of data
    //  and we want ReactiveVar's both for every record and for the entity
    self.autorun(() => {
        const dup = _.cloneDeep( Template.currentData().item || { DYN: { managers: [], records: [{}] }});
        let records = [];
        dup.DYN.records.forEach(( it ) => {
            records.push( new ReactiveVar( it ));
        });
        dup.DYN.records = records;
        self.APP.item.set( dup );
    });

    // initialize the Tabbed.Instance
    const paneData = {
        ...Template.currentData(),
        entity: self.APP.item,
        checker: self.APP.checker
    };
    const notesField = ClientsEntities.fieldSet.get().byName( 'notes' );
    self.APP.tabbed.setTabbedParms({
        tabs: [
            {
                name: 'client_entity_validities_tab',
                navLabel: pwixI18n.label( I18N, 'clients.edit.entity_validities_tab_title' ),
                paneTemplate: 'client_entity_validities_pane',
                paneData: {
                    ...paneData,
                    template: 'client_record_tabbed',
                },
                withValidities: true
            },
            {
                name: 'client_entity_properties_tab',
                navLabel: pwixI18n.label( I18N, 'clients.edit.entity_properties_tab_title' ),
                paneTemplate: 'client_entity_properties_pane',
                paneData: paneData
            },
            {
                name: 'client_entity_notes_tab',
                navLabel: pwixI18n.label( I18N, 'clients.edit.entity_notes_tab_title' ),
                paneTemplate: 'NotesEdit',
                paneData: {
                    ...paneData,
                    field: notesField
                }
            },
            {
                name: 'client_status_tab',
                navLabel: pwixI18n.label( I18N, 'clients.edit.status_tab_title' ),
                paneTemplate: 'client_status_pane',
                paneData: paneData
            }
        ]
    });
});

Template.client_edit_dialog.onRendered( function(){
    const self = this;

    // whether we are running inside of a Modal
    self.autorun(() => {
        self.APP.isModal.set( self.$( '.c-client-edit-dialog' ).parent().hasClass( 'modal-body' ));
    });

    // set the modal target
    self.autorun(() => {
        if( self.APP.isModal.get()){
            Modal.set({
                target: self.$( '.c-client-edit-dialog' )
            });
        }
    });

    // allocate a Checker for this (topmost parent) template
    self.APP.checker.set( new Forms.Checker( self, {
        messager: self.APP.messager,
        okFn( valid ){
            if( self.APP.isModal.get()){
                Modal.set({ buttons: { id: Modal.C.Button.OK, enabled: valid }});
            }
        }
    }));
});

Template.client_edit_dialog.helpers({
    // parms to FormsMessager
    parmsMessager(){
        return {
            messager: Template.instance().APP.messager
        };
    }
});

Template.client_edit_dialog.events({
    // submit
    //  event triggered in case of a modal
    'md-click .c-client-edit-dialog'( event, instance, data ){
        //console.debug( event, data );
        if( data.button.id === Modal.C.Button.OK ){
            instance.$( event.currentTarget ).trigger( 'iz-submit' );
        }
    },

    // submit
    'iz-submit .c-client-edit-dialog'( event, instance ){
        //console.debug( event, instance );
        const item = instance.APP.item.get();
        const label = Validity.closest( item ).record.label || '';
        //console.debug( 'item', item );
        Meteor.callAsync( 'client.upsert', item )
            .then(() => {
                Tolert.success( pwixI18n.label( I18N, instance.APP.isNew.get() ? 'clients.edit.new_success' : 'clients.edit.edit_success', label ));
                if( instance.APP.isModal.get()){
                    Modal.close();
                } else {
                    instance.$( '.c-client-properties-panel' ).trigger( 'iz-clear-panel' );
                    instance.$( '.NotesEdit' ).trigger( 'iz-clear-panel' );
                }
            })
            .catch(( e ) => {
                console.error( e );
                Tolert.error( pwixI18n.label( I18N, 'clients.edit.error' ));
            });
    }
});
