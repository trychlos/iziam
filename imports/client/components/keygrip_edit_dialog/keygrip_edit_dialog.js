/*
 * /imports/client/components/keygrip_edit_dialog/keygrip_edit_dialog.js
 *
 * A modal dialog which let the user edit cookies keygrip properties.
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

import '/imports/client/components/keygrip_properties_pane/keygrip_properties_pane.js';

import './keygrip_edit_dialog.html';

Template.keygrip_edit_dialog.onCreated( function(){
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
        tabbed: new Tabbed.Instance( self, { name: 'keygrip_edit_dialog' }),
        // a count of this keygrip secrets
        count: new ReactiveVar( 0 )
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

    // instanciates a named Tabbed
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
                name: 'keygrip_properties_pane',
                navLabel: pwixI18n.label( I18N, 'keygrips.edit.properties_tab_title' ),
                paneTemplate: 'keygrip_properties_pane'
            }
        ],
        activateLastTab: false
    });

    // track the count of keygrip secrets
    self.autorun(() => {
        self.APP.count.set((( self.APP.item.get().keylist ) || [] ).length );
    });
});

Template.keygrip_edit_dialog.onRendered( function(){
    const self = this;
    //console.debug( self );

    // whether we are running inside of a Modal
    self.autorun(() => {
        self.APP.isModal.set( self.$( '.c-keygrip-edit-dialog' ).parent().hasClass( 'modal-body' ));
    });

    // set the modal target
    self.autorun(() => {
        if( self.APP.isModal.get()){
            Modal.set({
                target: self.$( '.c-keygrip-edit-dialog' )
            });
        }
    });

    // initialize the Checker for this panel as soon as possible
    // doesn't need any autorun here
    self.APP.checker.set( new Forms.Checker( self, {
        messager: self.APP.messager,
        okFn( valid ){
            if( self.APP.isModal.get()){
                Modal.set({ buttons: { id: Modal.C.Button.OK, enabled: valid && self.APP.count.get() > 0 }});
            }
        }
    }));
});

Template.keygrip_edit_dialog.helpers({
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

Template.keygrip_edit_dialog.events({
    // submit
    //  event triggered in case of a modal
    'md-click .c-keygrip-edit-dialog'( event, instance, data ){
        //console.debug( event, data );
        if( data.button.id === Modal.C.Button.OK ){
            instance.$( event.currentTarget ).trigger( 'iz-submit' );
        }
    },

    // submit
    // reactively update the record
    'iz-submit .c-keygrip-edit-dialog'( event, instance ){
        const recordRv = this.entity.get().DYN.records[this.index];
        let record = recordRv.get();
        record.keygrips = record.keygrips || [];
        let found = false;
        const item = instance.APP.item.get();
        // update or push
        for( let i=0 ; i<record.keygrips.length ; ++i ){
            if( record.keygrips[i]._id === item._id ){
                record.keygrips[i] = item;
                found = true;
                break;
            }
        }
        if( !found ){
            record.keygrips.push( item );
        }
        recordRv.set( record );
        Modal.close();
    }
});
