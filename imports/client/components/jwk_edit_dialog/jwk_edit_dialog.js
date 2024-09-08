/*
 * /imports/client/components/jwk_edit_dialog/jwk_edit_dialog.js
 *
 * Manage a JSON Web Key, maybe empty but have at least an id.
 *
 * Parms:
 * - entity: a ReactiveVar which contains the Organization, with its DYN.records array of ReactiveVar's
 * - index: the index of the current edited organization record
 * - checker: a ReactiveVar which holds the parent Checker
 * - item: the JWK item to be edited here
 */

import _ from 'lodash';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { Random } from 'meteor/random';
import { TenantsManager } from 'meteor/pwix:tenants-manager';

import '/imports/client/components/jwk_properties_pane/jwk_properties_pane.js';

import './jwk_edit_dialog.html';

Template.jwk_edit_dialog.onCreated( function(){
    const self = this;
    //console.debug( this );

    self.APP = {
        // the Form.Checker instance for this panel
        checker: new ReactiveVar( null ),
        // the global Message zone for this modal
        messager: new Forms.Messager(),
        // the edited item
        item: new ReactiveVar( null ),
        // whether we are running inside of a Modal
        isModal: new ReactiveVar( false )
    };

    // get the edited item
    self.autorun(() => {
        let item = Template.currentData().item;
        if( !item ){
            item = {
                id: Random.id()
            };
            let record = Template.currentData().entity.get().DYN.records[Template.currentData().index].get();
            record.jwks = record.jwks || [];
            record.jwks.push( item );
        }
        self.APP.item.set( item );
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

    // initialize the Checker for this panel as soon as we get the parent Checker
    self.autorun(() => {
        const parentChecker = Template.currentData().checker.get();
        const checker = self.APP.checker.get();
        if( parentChecker && !checker ){
            self.APP.checker.set( new Forms.Checker( self, {
                parent: parentChecker,
                messager: self.APP.messager,
                okFn( valid ){
                    if( self.APP.isModal ){
                        Modal.set({ buttons: { id: Modal.C.Button.OK, enabled: valid }});
                    }
                }
            }));
        }
    });
});

Template.jwk_edit_dialog.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for the the Tabbed dialog
    parmsTabbed(){
        APP = Template.instance().APP;
        const paneData = {
            ...this,
            item: APP.item,
            checker: APP.checker
        };
        let tabs = [
            {
                tabid: 'jwk_properties_tab',
                paneid: 'jwk_properties_pane',
                navLabel: pwixI18n.label( I18N, 'jwks.edit.properties_tab_title' ),
                paneTemplate: 'jwk_properties_pane',
                paneData: paneData
            }
        ];
        return {
            tabs: tabs
        };
    }
});
