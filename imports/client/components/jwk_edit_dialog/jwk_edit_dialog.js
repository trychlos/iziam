/*
 * /imports/client/components/jwk_edit_dialog/jwk_edit_dialog.js
 *
 * Manage a JSON Web Key, maybe empty but have at least an id.
 * A JWK cannot be edited: once created (an published), it can only be deleted (or revoked).
 * The item edition only displays the JWK, cannot edit it.
 *
 * Parms:
 * - entity: a ReactiveVar which contains the Organization, with its DYN.records array of ReactiveVar's
 * - index: the index of the current edited organization record
 * - item: the JWK item to be edited here
 */

import _ from 'lodash';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { Random } from 'meteor/random';
import { Tabbed } from 'meteor/pwix:tabbed';

import '/imports/client/components/jwk_keyspair_pane/jwk_keyspair_pane.js';
import '/imports/client/components/jwk_private_pane/jwk_private_pane.js';
import '/imports/client/components/jwk_properties_pane/jwk_properties_pane.js';
import '/imports/client/components/jwk_public_pane/jwk_public_pane.js';
import '/imports/client/components/jwk_secret_pane/jwk_secret_pane.js';

import './jwk_edit_dialog.html';

Template.jwk_edit_dialog.onCreated( function(){
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
        tabbed: new ReactiveVar( null )
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
        self.APP.tabbed.set( new Tabbed.Instance( self, new ReactiveVar({
            name: 'jwk_edit_dialog',
            dataContext: {
                organization: { entity: Template.currentData().entity.get(), record: Template.currentData().entity.get().DYN.records[Template.currentData().index].get() },
                item: self.APP.item,
                checker: self.APP.checker,
                isNew: self.APP.isNew
            },
            tabs: [
                {
                    name: 'jwk_properties_tab',
                    navLabel: pwixI18n.label( I18N, 'jwks.edit.properties_tab_title' ),
                    paneTemplate: 'jwk_properties_pane'
                },
                {
                    name: 'jwk_secret_tab',
                    navLabel: pwixI18n.label( I18N, 'jwks.edit.secret_tab_title' ),
                    paneTemplate: 'jwk_secret_pane',
                    enabled: false
                },
                {
                    name: 'jwk_keyspair_tab',
                    navLabel: pwixI18n.label( I18N, 'jwks.edit.keyspair_tab_title' ),
                    paneTemplate: 'jwk_keyspair_pane',
                    enabled: false
                }
            ]
        })));
    });
});

Template.jwk_edit_dialog.onRendered( function(){
    const self = this;

    // whether we are running inside of a Modal
    self.autorun(() => {
        self.APP.isModal.set( self.$( '.c-jwk-edit-dialog' ).closest( '.modal-dialog' ).length > 0 );
    });

    // set the modal target
    self.autorun(() => {
        if( self.APP.isModal.get()){
            Modal.set({
                target: self.$( '.c-jwk-edit-dialog' )
            });
        }
    });

    // initialize the Checker for this panel as soon as possible
    // doesn't need any autorun here
    self.APP.checker.set( new Forms.Checker( self, {
        messager: self.APP.messager,
        okFn( valid ){
            if( self.APP.isModal ){
                Modal.set({ buttons: { id: Modal.C.Button.OK, enabled: valid }});
            }
        }
    }));
});

Template.jwk_edit_dialog.helpers({
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

Template.jwk_edit_dialog.events({
    // submit
    //  event triggered in case of a modal
    'md-click .c-jwk-edit-dialog'( event, instance, data ){
        //console.debug( event, data );
        if( data.button.id === Modal.C.Button.OK ){
            instance.$( event.currentTarget ).trigger( 'iz-submit' );
        }
    },

    // submit
    // reactively update the record
    'iz-submit .c-jwk-edit-dialog'( event, instance ){
        const recordRv = this.entity.get().DYN.records[this.index];
        let record = recordRv.get();
        record.jwks = record.jwks || [];
        let found = false;
        const jwk = instance.APP.item.get();
        //console.debug( 'jwk', jwk );
        for( let i=0 ; i<record.jwks.length ; ++i ){
            if( record.jwks[i].id === jwk.id ){
                record.jwks[i] = jwk;
                found = true;
                break;
            }
        }
        if( !found ){
            record.jwks.push( jwk );
        }
        recordRv.set( record );
        Modal.close();
    }
});
