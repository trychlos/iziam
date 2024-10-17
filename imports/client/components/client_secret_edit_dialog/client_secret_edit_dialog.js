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

import { ClientSecrets } from '/imports/common/tables/client_secrets/index.js';

import '/imports/client/components/client_secret_generate_pane/client_secret_generate_pane.js';
import '/imports/client/components/client_secret_properties_pane/client_secret_properties_pane.js';
import '/imports/client/components/client_secret_secret_pane/client_secret_secret_pane.js';

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
        let item = dcItem ? _.cloneDeep( dcItem ) : { _id: Random.id() };
        self.APP.item.set( item );
        self.APP.isNew.set( dcItem === null );
    });

    // track the item content
    self.autorun(() => {
        //console.debug( 'item', self.APP.item.get());
    });

    // initialize the Tabbed.Instance
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
            },
            {
                name: 'client_secret_generate_pane',
                navLabel: pwixI18n.label( I18N, 'clients.secrets.edit.generate_tab_title' ),
                paneTemplate: 'client_secret_generate_pane'
            },
            {
                name: 'client_secret_secret_pane',
                navLabel: pwixI18n.label( I18N, 'clients.secrets.edit.secret_tab_title' ),
                paneTemplate: 'client_secret_secret_pane',
                enabled: false
            }
        ],
        activateLastTab: false
    });

    // dynamically update the tabs activability
    self.autorun(() => {
        self.APP.tabbed.set( 'tab.client_secret_generate_pane.shown', self.APP.isNew.get());
    });
    self.autorun(() => {
        const item = self.APP.item.get();
        self.APP.tabbed.set( 'tab.client_secret_secret_pane.enabled', Boolean( item.createdAt ));
    })
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
        let secret = instance.APP.item.get();
        // if the secret have not been generated yet, do it now
        Promise.resolve( true )
            .then(() => {
                if( secret.createdAt ){
                    return secret;
                }
                return ClientSecrets.fn.generateSecret( secret ).then(( res ) => {
                    Tolert.success( pwixI18n.label( I18N, 'clients.secrets.edit.generated' ));
                    return res;
                });
            })
            .then(( res ) => {
                secret = res;
                if( instance.APP.isNew.get()){
                    record.secrets.push( secret );
                } else {
                    for( let i=0 ; i<record.secrets.length ; ++i ){
                        if( record.secrets[i]._id === secret._id ){
                            record.secrets[i] = secret;
                            found = true;
                            break;
                        }
                    }
                    if( !found ){
                        console.warn( 'unable to update the client secret', secret );
                    }
                }
            })
            .then(() => {
                recordRv.set( record );
                Modal.close();
            });
    }
});
