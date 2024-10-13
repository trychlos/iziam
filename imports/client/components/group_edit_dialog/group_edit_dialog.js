/*
 * /imports/group/components/group_edit_dialog/group_edit_dialog.js
 *
 * Let the organization manager define a new group.
 * Can be called:
 * - either as any other sort of new client/identity/etc. -> and store into the database
 * - or from an tree edit session, and the the new item is to go into the edited groups list
 *
 * Parms:
 * - item: the group to be edited, or null
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - plus all plusButton parameters will be passed through
 * - organization: an { entity, record } organization object
 * - targetDatabase: whether the new group is to be storfed in the database, defaulting to true
 * - groupsRv: when targetDatabase is false, a ReactiveVar which contains the groups where the new group item is to be pushed
 */

import _ from 'lodash';

import { Forms } from 'meteor/pwix:forms';
import { Modal } from 'meteor/pwix:modal';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tabbed } from 'meteor/pwix:tabbed';
import { Tolert } from 'meteor/pwix:tolert';

import { Groups } from '/imports/common/collections/groups/index.js';

import '/imports/client/components/group_children_pane/group_children_pane.js';
import '/imports/client/components/group_properties_pane/group_properties_pane.js';

import './group_edit_dialog.html';

Template.group_edit_dialog.onCreated( function(){
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
        tabbed: new Tabbed.Instance( self, { name: 'group_edit_dialog' })
    };

    // keep the initial 'new' state
    self.autorun(() => {
        self.APP.isNew.set( _.isNil( Template.currentData().item ));
    });

    // setup the item to be edited
    //  we want a clone deep of the provided item, so that we are able to cancel the edition without keeping any sort of data
    self.autorun(() => {
        const dup = _.cloneDeep( Template.currentData().item || {
            organization: Template.currentData().organization.entity._id,
            type: 'G',
            DYN: { children: [] }
        });
        self.APP.item.set( dup );
    });

    // initialize the Tabbed.Instance
    const paneData = {
        ...Template.currentData(),
        item: self.APP.item,
        checker: self.APP.checker
    };
    const notesField = Groups.fieldSet.get().byName( 'notes' );
    self.APP.tabbed.setTabbedParms({
        tabs: [
            {
                name: 'group_properties_tab',
                navLabel: pwixI18n.label( I18N, 'groups.edit.properties_tab_title' ),
                paneTemplate: 'group_properties_pane',
                paneData: paneData
            },
            {
                name: 'group_children_tab',
                navLabel: pwixI18n.label( I18N, 'groups.edit.children_tab_title' ),
                paneTemplate: 'group_children_pane',
                paneData: paneData
            },
            {
                name: 'group_notes_tab',
                navLabel: pwixI18n.label( I18N, 'groups.edit.notes_tab_title' ),
                paneTemplate: 'NotesEdit',
                paneData: {
                    ...paneData,
                    field: notesField
                }
            }
        ]
    });
});

Template.group_edit_dialog.onRendered( function(){
    const self = this;

    // whether we are running inside of a Modal
    self.autorun(() => {
        self.APP.isModal.set( self.$( '.c-group-edit-dialog' ).parent().hasClass( 'modal-body' ));
    });

    // set the modal target
    self.autorun(() => {
        if( self.APP.isModal.get()){
            Modal.set({
                target: self.$( '.c-group-edit-dialog' )
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

Template.group_edit_dialog.helpers({
    // parms to FormsMessager
    parmsMessager(){
        return {
            messager: Template.instance().APP.messager
        };
    }
});

Template.group_edit_dialog.events({
    // submit
    //  event triggered in case of a modal
    'md-click .c-group-edit-dialog'( event, instance, data ){
        //console.debug( event, data );
        if( data.button.id === Modal.C.Button.OK ){
            instance.$( event.currentTarget ).trigger( 'iz-submit' );
        }
    },

    // submit
    'iz-submit .c-group-edit-dialog'( event, instance ){
        //console.debug( event, instance );
        const item = instance.APP.item.get();
        const closeFn = function(){
            if( instance.APP.isModal.get()){
                Modal.close();
            } else {
                instance.$( '.c-group-properties-panel' ).trigger( 'iz-clear-panel' );
                instance.$( '.NotesEdit' ).trigger( 'iz-clear-panel' );
            }
        }
        if( this.targetDatabase !== false ){
            Meteor.callAsync( 'groups.upsert_item', item )
                .then(() => {
                    Tolert.success( pwixI18n.label( I18N, instance.APP.isNew.get() ? 'groups.edit.group_new_success' : 'groups.edit.group_edit_success', item.label ));
                    closeFn();
                })
                .catch(( e ) => {
                    console.error( e );
                    Tolert.error( pwixI18n.label( I18N, 'groups.edit.error' ));
                });
        } else {
            if( this.groupsRv && this.groupsRv instanceof ReactiveVar ){
                let groups = this.groupsRv.get();
                if( _.isArray( groups )){
                    let found = null;
                    for( let i=0 ; i<groups.length ; ++i ){
                        if( groups[i]._id === item._id ){
                            groups[i] = item;
                            found = true;
                            break;
                        }
                    }
                    if( !found ){
                        groups.push( item );
                    }
                    this.groupsRv.set( groups );
                }
            }
            closeFn();
        }
    }
});
