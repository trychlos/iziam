/*
 * /imports/client/components/client_secret_edit_dialog/client_secret_edit_dialog.js
 *
 * A modal dialog which let the user edit secret properties.
 * 
 * Parms:
 * - entity: a ReactiveVar which contains the Organization, with its DYN.records array of ReactiveVar's
 * - index: the index of the current edited organization record
 * - item: the Keygrip item to be edited here, may be null
 */

import _ from 'lodash';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { Random } from 'meteor/random';
import { Tabbed } from 'meteor/pwix:tabbed';

import '/imports/client/components/client_secret_properties_pane/client_secret_properties_pane.js';

import './client_secret_edit_dialog.html';

Template.client_secret_edit_dialog.onCreated( function(){
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
        tabbed: new Tabbed.Instance( self, { name: 'client_secret_edit_dialog' })
    };

    // get the edited item
    // it will go into the currently edited organization record only if the user validates this dialog box
    self.autorun(() => {
        const dcItem = Template.currentData().item;
        let item = dcItem ? _.cloneDeep( dcItem ) : { id: Random.id() };
        self.APP.item.set( item );
        self.APP.isNew.set( dcItem === null );
    });

    // track the item content
    self.autorun(() => {
        //console.debug( 'item', self.APP.item.get());
    });

    // instanciates a named Tabbed
    self.autorun(() => {
        self.APP.tabbed.setTabbedParms({ 
            dataContext: {
                entity: Template.currentData().entity,
                index: Template.currentData().index,
                container: { entity: Template.currentData().entity.get(), record: Template.currentData().entity.get().DYN.records[Template.currentData().index].get() },
                item: self.APP.item,
                checker: self.APP.checker,
                isNew: self.APP.isNew
            },
            tabs: [
                {
                    name: 'client_secret_properties_pane',
                    navLabel: pwixI18n.label( I18N, 'clients.secrets.edit.properties_tab_title' ),
                    paneTemplate: 'client_secret_properties_pane'
                }
            ]
        });
    });
});

Template.client_secret_edit_dialog.onRendered( function(){
    const self = this;
    //console.debug( self );

    // whether we are running inside of a Modal
    self.autorun(() => {
        self.APP.isModal.set( self.$( '.c-client-secret-edit-dialog' ).parent().hasClass( 'modal-body' ));
    });

    // set the modal target
    self.autorun(() => {
        if( self.APP.isModal.get()){
            Modal.set({
                target: self.$( '.c-client-secret-edit-dialog' )
            });
        }
    });

    // initialize the Checker for this panel as soon as possible
    // doesn't need any autorun here
    self.APP.checker.set( new Forms.Checker( self, {
        messager: self.APP.messager,
        okFn( valid ){
            if( self.APP.isModal.get()){
                Modal.set({ buttons: { id: Modal.C.Button.OK, enabled: valid }});
            }
        }
    }));
});

Template.client_secret_edit_dialog.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for the Forms.Messager
    parmsMessager(){
        return {
            messager: Template.instance().APP.messager
        };
    }
});

Template.client_secret_edit_dialog.events({
    // submit
    //  event triggered in case of a modal
    'md-click .c-client-secret-edit-dialog'( event, instance, data ){
        //console.debug( event, data );
        if( data.button.id === Modal.C.Button.OK ){
            instance.$( event.currentTarget ).trigger( 'iz-submit' );
        }
    },

    // submit
    // reactively update the record
    'iz-submit .c-client-secret-edit-dialog'( event, instance ){
        const recordRv = this.entity.get().DYN.records[this.index];
        let record = recordRv.get();
        record.secrets = record.secrets || [];
        let found = false;
        let item = instance.APP.item.get();
        // update or push
        if( instance.APP.isNew.get()){
            Meteor.callAsync( 'client_generate_secret', item ).then(( res ) => {
                _.merge( item, res, {
                    createdAt: new Date(),
                    createdBy: Meteor.userId()
                });
                record.secrets.push( item );
            });
        } else {
            for( let i=0 ; i<record.secrets.length ; ++i ){
                if( record.secrets[i].id === item.id ){
                    record.secrets[i] = item;
                    break;
                }
            }
        }
        recordRv.set( record );
        Modal.close();
    }
});
