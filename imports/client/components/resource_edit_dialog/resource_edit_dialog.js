/*
 * /imports/client/components/resource_edit_dialog/resource_edit_dialog.js
 *
 * A modal dialog which let the user edit resource properties.
 * 
 * Parms:
 * - item: the resource item to be edited here, may be null
 * - entity: the Organization, with its DYN.records array of ReactiveVar's
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Forms } from 'meteor/pwix:forms';
import { Modal } from 'meteor/pwix:modal';
import { pwixI18n } from 'meteor/pwix:i18n';
import { Random } from 'meteor/random';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tabbed } from 'meteor/pwix:tabbed';
import { Tolert } from 'meteor/pwix:tolert';

import { Resources } from '/imports/common/collections/resources/index.js';

import '/imports/client/components/resource_properties_pane/resource_properties_pane.js';

import './resource_edit_dialog.html';

Template.resource_edit_dialog.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        // the Form.Checker instance for this dialog
        checker: new ReactiveVar( null ),
        // the global Message zone for this modal
        messager: new Forms.Messager(),
        // the edited item as a copy of the provided, or a new one
        item: new ReactiveVar( null ),
        // whether we are running inside of a Modal
        isModal: new ReactiveVar( false ),
        // whether we are creating a new JWK
        isNew: new ReactiveVar( false ),
        // the Tabbed instance
        tabbed: new Tabbed.Instance( self, { name: 'resource_edit_dialog' })
    };

    // get the edited item
    // it will go into the currently edited organization record only if the user validates this dialog box
    self.autorun(() => {
        const dcItem = Template.currentData().item;
        let item = dcItem ? _.cloneDeep( dcItem ) : { organization: Template.currentData().entity._id, _id: Random.id() };
        self.APP.item.set( item );
        self.APP.isNew.set( dcItem === null );
    });

    // track the item content
    self.autorun(() => {
        //console.debug( 'item', self.APP.item.get());
    });

    // initialize the named Tabbed
    const item = self.APP.item.get();
    self.APP.tabbed.setTabbedParms({ 
        dataContext: {
            entity: Template.currentData().entity,
            item: self.APP.item,
            checker: self.APP.checker,
            isNew: self.APP.isNew
        },
        tabs: [
            {
                name: 'resource_properties_tab',
                navLabel: pwixI18n.label( I18N, 'resources.edit.properties_tab_title' ),
                paneTemplate: 'resource_properties_pane'
            },
            {
                name: 'resource_notes_tab',
                navLabel: pwixI18n.label( I18N, 'resources.edit.notes_tab_title' ),
                paneTemplate: 'NotesEdit',
                paneData: {
                    item: self.APP.item.get(),
                    field: Resources.fieldSet.get().byName( 'notes' )
                }
            }
        ]
    });
});

Template.resource_edit_dialog.onRendered( function(){
    const self = this;
    //console.debug( self );

    // whether we are running inside of a Modal
    self.autorun(() => {
        self.APP.isModal.set( self.$( '.c-resource-edit-dialog' ).parent().hasClass( 'modal-body' ));
    });

    // set the modal target
    self.autorun(() => {
        if( self.APP.isModal.get()){
            Modal.set({
                target: self.$( '.c-resource-edit-dialog' )
            });
        }
    });

    // initialize the Checker for this panel as soon as possible
    // no need for an autorun when we do not wait for a parent checker
    self.APP.checker.set( new Forms.Checker( self, {
        messager: self.APP.messager,
        okFn( valid ){
            if( self.APP.isModal.get()){
                Modal.set({ buttons: { id: Modal.C.Button.OK, enabled: valid }});
            }
        }
    }));
});

Template.resource_edit_dialog.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // whether we run inside of a modal ?
    isModal(){
        return Template.instance().APP.isModal.get();
    },

    // parms for the Forms.Messager
    parmsMessager(){
        return {
            messager: Template.instance().APP.messager
        };
    }
});

Template.resource_edit_dialog.events({
    // submit
    //  event triggered in case of a modal
    'md-click .c-resource-edit-dialog'( event, instance, data ){
        //console.debug( event, data );
        if( data.button.id === Modal.C.Button.OK ){
            instance.$( event.currentTarget ).trigger( 'iz-submit' );
        }
    },

    // submit
    // reactively update the record
    // the user may have already generated its keys - if not, we compute them here
    'iz-submit .c-resource-edit-dialog'( event, instance ){
        const item = instance.APP.item.get();
        const closeFn = function(){
            if( instance.APP.isModal.get()){
                Modal.close();
            } else {
                instance.$( '.c-resource-properties-panel' ).trigger( 'iz-clear-panel' );
                instance.$( '.NotesEdit' ).trigger( 'iz-clear-panel' );
            }
        };
        Meteor.callAsync( 'resources.upsert', this.entity._id, item )
            .then(() => {
                Tolert.success( pwixI18n.label( I18N, instance.APP.isNew.get() ? 'resources.edit.new_success' : 'resources.edit.edit_success', item.label || item.name ));
                closeFn();
            })
            .catch(( e ) => {
                console.error( e );
                Tolert.error( pwixI18n.label( I18N, 'resources.edit.error' ));
            });
    }
});
