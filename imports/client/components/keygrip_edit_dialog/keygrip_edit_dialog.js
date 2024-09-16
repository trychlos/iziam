/*
 * /imports/client/components/keygrip_edit_dialog/keygrip_edit_dialog.js
 *
 * A modal dialog which let the user edit cookies keygrip properties.
 * Doesn't manage validities.
 * 
 * Parms:
 * - organization: a ReactiveVar which contains the current organization at date
 */

import _ from 'lodash';

import { CoreApp } from 'meteor/pwix:core-app';
import { Modal } from 'meteor/pwix:modal';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tolert } from 'meteor/pwix:tolert';

//import '/imports/client/components/oauth_keygrip_properties_pane/oauth_keygrip_properties_pane.js';
//import '/imports/client/components/oauth_keygrip_secrets_pane/oauth_keygrip_secrets_pane.js';

import './keygrip_edit_dialog.html';

Template.keygrip_edit_dialog.onCreated( function(){
    const self = this;

    self.APP = {
        // the EntityChecker for the dialog (must be a ReactiveVar because used in template helpers)
        checker: new ReactiveVar( null ),
        // maintain here the data provided by the panels
        dataParts: {},
        // whether the dialog is validable ?
        okEnabled: new ReactiveVar( false ),
        // make the data context item a reactive var
        itemRv: new ReactiveVar()
    };

    // allocate an EntityChecker for the dialog
    self.APP.checker.set( new CoreApp.EntityChecker({
        instance: self
    }));

    // setup our item ReactiveVar, making sure it is not synchronized with the passed-in organization record
    self.autorun(() => {
        self.APP.itemRv.set( _.cloneDeep( Template.currentData().organization.get()));
    });
});

Template.keygrip_edit_dialog.onRendered( function(){
    const self = this;
    //console.debug( self );

    // set the modal target and title
    Modal.set({
        target: self.$( '.c-keygrip-edit-dialog' ),
        title: pwixI18n.label( I18N, 'oauth.keygrips.modal_title' )
    });

    // enable the OK button
    self.autorun(() => {
        Modal.set({ buttons: { id: Modal.C.Button.OK, enabled: self.APP.okEnabled.get() }});
    });
});

Template.keygrip_edit_dialog.helpers({
    // parms to coreErrorMsg
    parmsErrorMsg(){
        return {
            errorsSet: Template.instance().APP.checker.get()?.getErrorsSet() || null
        };
    },

    // pass to coreTabbedTemplate
    //  - from the caller:
    //      > original group, may be null
    //      > withValidities, defaulting to true
    //  - from our own:
    //      > the template to be rendered for each validity period
    //      > our EntityChecker instance (for child templates)
    parmsTabbed(){
        const dataContext = this;
        const APP = Template.instance().APP;
        return {
            tabs: [
                {
                    navLabel: pwixI18n.label( I18N, 'oauth.keygrips.properties_tab' ),
                    paneTemplate: 'oauth_keygrip_properties_pane',
                    paneData: {
                        item: APP.itemRv,
                        entityChecker: APP.entityChecker
                    }
                },
                {
                    navLabel: pwixI18n.label( I18N, 'oauth.keygrips.secrets_tab' ),
                    paneTemplate: 'oauth_keygrip_secrets_pane',
                    paneData: {
                        item: APP.itemRv,
                        entityChecker: APP.entityChecker
                    }
                },
                {
                    navLabel: pwixI18n.label( I18N, 'ext_notes.panel.tab_title' ),
                    paneTemplate: 'ext_notes_panel',
                    paneData(){
                        return {
                            notes: APP.itemRv.get().notes,
                            event: 'panel-data',
                            data: {
                                emitter: 'notes'
                            }
                        };
                    }
                }
            ],
            name: 'oauth_keygrip_tabbed'
        }
    }
});

Template.keygrip_edit_dialog.events({
    // gathers all the data for the entity (several nested tabs)
    // we do not really care of the datas here, as organization_tabbed takes care of each of the items
    //  but we do care of the validity status of each tab
    'panel-data .c-keygrip-edit-dialog'( event, instance, data ){
        //console.debug( event, instance, data );
        instance.APP.dataParts[ data.emitter ] = instance.APP.dataParts[ data.emitter ] || {};
        instance.APP.dataParts[ data.emitter ].data = data.data;
        instance.APP.dataParts[ data.emitter ].ok = data.ok;
        // set the item with the provided data
        switch( data.emitter ){
            case 'notes':
                instance.APP.itemRv.get().notes = data.data;
                break;
        }
        // enable the OK button if all is OK
        let ok = true;
        Object.keys( instance.APP.dataParts ).every(( emitter ) => {
            ok &&= instance.APP.dataParts[emitter].ok;
            //console.debug( 'id', id, 'datapart', instance.APP.dataParts[id], 'ok', ok );
            return ok;
        });
        instance.APP.okEnabled.set( ok );
    },

    // submit 
    //  event triggered in case of a modal
    'md-click .c-keygrip-edit-dialog'( event, instance, data ){
        //console.debug( event, data );
        if( data.button.id === Modal.C.Button.OK ){
            instance.$( event.currentTarget ).trigger( 'iz-submit' );
        }
    },

    // submit
    //  manage both creation and update
    'iz-submit .c-keygrip-edit-dialog'( event, instance ){
        //console.debug( event, data, data.edited, data.edited.length );
        const self = this;
        const item = instance.APP.itemRv.get();
        Meteor.callPromise( 'organization.updateItem', item )
            .then(( result_item ) => {
                Tolert.success( pwixI18n.label( I18N, 'oauth.keygrips.edit_success', item.label ));
                self.organization.set( result_item );
                Modal.close();
            })
            .catch(( e ) => {
                console.error( e );
                Tolert.error( pwixI18n.label( I18N, 'oauth.keygrips.edit_error' ));
            });
    }
});
