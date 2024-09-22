/*
 * /imports/client/components/jwk_edit_dialog/jwk_edit_dialog.js
 *
 * A modal dialog which let the user edit jwk properties.
 * 
 * Parms:
 * - entity: a ReactiveVar which contains the Organization, with its DYN.records array of ReactiveVar's
 * - index: the index of the current edited organization record
 * - item: the JWK item to be edited here, may be null
 */

import _ from 'lodash';

import { Forms } from 'meteor/pwix:forms';
import { Modal } from 'meteor/pwix:modal';
import { pwixI18n } from 'meteor/pwix:i18n';
import { Random } from 'meteor/random';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tabbed } from 'meteor/pwix:tabbed';
import { Tolert } from 'meteor/pwix:tolert';

import { Jwks } from '/imports/common/tables/jwks/index.js';

import '/imports/client/components/jwk_generate_pane/jwk_generate_pane.js';
import '/imports/client/components/jwk_keyspair_pane/jwk_keyspair_pane.js';
import '/imports/client/components/jwk_private_jwk_pane/jwk_private_jwk_pane.js';
import '/imports/client/components/jwk_private_pkcs8_pane/jwk_private_pkcs8_pane.js';
import '/imports/client/components/jwk_properties_pane/jwk_properties_pane.js';
import '/imports/client/components/jwk_public_jwk_pane/jwk_public_jwk_pane.js';
import '/imports/client/components/jwk_public_spki_pane/jwk_public_spki_pane.js';
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
        tabbed: new Tabbed.Instance( self, { name: 'jwk_edit_dialog' })
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

    // initialize the named Tabbed
    const item = self.APP.item.get();
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
                name: 'jwk_properties_tab',
                navLabel: pwixI18n.label( I18N, 'jwks.edit.properties_tab_title' ),
                paneTemplate: 'jwk_properties_pane'
            },
            {
                name: 'jwk_generate_tab',
                navLabel: pwixI18n.label( I18N, 'jwks.edit.generate_tab_title' ),
                paneTemplate: 'jwk_generate_pane',
                enabled: false
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
    });

    // dynamically update the tabs activability
    self.autorun(() => {
        self.APP.tabbed.set( 'tab.jwk_generate_tab.shown', self.APP.isNew.get());
    });
    self.autorun(() => {
        const item = self.APP.item.get();
        self.APP.tabbed.set( 'tab.jwk_secret_tab.enabled', Boolean( item.createdAt && item.secret ));
        self.APP.tabbed.set( 'tab.jwk_keyspair_tab.enabled', Boolean( item.createdAt && item.pair ));
    })
});

Template.jwk_edit_dialog.onRendered( function(){
    const self = this;
    //console.debug( self );

    // whether we are running inside of a Modal
    self.autorun(() => {
        self.APP.isModal.set( self.$( '.c-jwk-edit-dialog' ).parent().hasClass( 'modal-body' ));
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
    // no need for an autorun when we do not wait for a parent checker
    self.APP.checker.set( new Forms.Checker( self, {
        messager: self.APP.messager,
        okFn( valid ){
            if( self.APP.isModal.get()){
                Modal.set({ buttons: { id: Modal.C.Button.OK, enabled: valid }});
            }
            self.APP.tabbed.set( 'tab.jwk_generate_tab.enabled', valid );
        }
    }));
});

Template.jwk_edit_dialog.helpers({
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
    // the user may have already generated its keys - if not, we compute them here
    'iz-submit .c-jwk-edit-dialog'( event, instance ){
        const recordRv = this.entity.get().DYN.records[this.index];
        let record = recordRv.get();
        record.jwks = record.jwks || [];
        let found = false;
        let jwk = instance.APP.item.get();
        // if the secret/keys pair have not been generated yet, do it now
        Promise.resolve( true )
            .then(() => {
                if( jwk.createdAt ){
                    return jwk;
                }
                return Jwks.fn.generateKeys( jwk ).then(( res ) => {
                    Tolert.success( pwixI18n.label( I18N, 'jwks.edit.generated' ));
                    return res;
                });
            })
            .then(( res ) => {
                jwk = res;
                if( instance.APP.isNew.get()){
                    record.jwks.push( jwk );
                } else {
                    for( let i=0 ; i<record.jwks.length ; ++i ){
                        if( record.jwks[i].id === jwk.id ){
                            record.jwks[i] = jwk;
                            found = true;
                            break;
                        }
                    }
                    if( !found ){
                        console.warn( 'unable to update the JWK', jwk );
                    }
                }
            })
            .then(() => {
                recordRv.set( record );
                Modal.close();
            });
    }
});
