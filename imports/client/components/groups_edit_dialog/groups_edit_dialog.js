/*
 * /imports/client/components/groups_edit_dialog/groups_edit_dialog.js
 *
 * Display the groups tree as an editable component with dnD and delete features.
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization as an entity with its DYN.records array
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - groups: the groups of the organization
 * - editable, defaulting to true
 */

import _ from 'lodash';

import { Modal } from 'meteor/pwix:modal';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import '/imports/client/components/groups_buttons/groups_buttons.js';
import '/imports/client/components/groups_tree/groups_tree.js';

import './groups_edit_dialog.html';

Template.groups_edit_dialog.onCreated( function(){
    const self = this;

    self.APP = {
        // whether we are running inside of a Modal
        isModal: new ReactiveVar( false ),
        // the organization as an { entity, record } object
        organization: new ReactiveVar( null ),
        // a deep copy of the groups
        groups: new ReactiveVar( [] ),
        // a function to get the tree content
        tree_getfn: new ReactiveVar( null ),
        // the current tree selection
        tree_selected: new ReactiveVar( null ),
        // whether the buttons can be enabled
        editEnabled: new ReactiveVar( false ),
        deleteEnabled: new ReactiveVar( false ),
        removeEnabled: new ReactiveVar( false ),

        // delete the selected item
        //  this is expected to be a group to remove from the list
        deleteItem(){
            const node = self.APP.tree_selected.get();
            if( node ){
                let groups = self.APP.groups.get();
                for( let i=0 ; i<groups.length ; ++i ){
                    if( groups[i]._id === node.original.doc._id ){
                        groups.splice( i, 1 );
                        self.APP.tree_selected.set( null );
                        break;
                    }
                }
                self.APP.groups.set( groups );
            }
        },

        // return the tree of nodes
        getTree(){
            let tree = [];
            const fn = self.APP.tree_getfn.get();
            if( fn && typeof fn === 'function' ){
                tree = fn(( doc ) => {
                    delete doc.DYN;
                });
            }
            return tree;
        },

        // return the selected item
        selectedItem(){
            const node = self.APP.tree_selected.get();
            return node.original.doc;
        }
    };

    // build the organization { entity, record } object
    self.autorun(() => {
        const item = Template.currentData().item.get();
        self.APP.organization.set({
            entity: item,
            record: item.DYN.closest
        });
    });

    // edit a copy of the groups
    self.autorun(() => {
        self.APP.groups.set( _.cloneDeep( Template.currentData().groups ));
    });

    // enable/disable the buttons
    self.autorun(() => {
        const node = self.APP.tree_selected.get();
        const type = node && node.type ? node.type : null
        self.APP.editEnabled.set( type === 'G' );
        self.APP.deleteEnabled.set( type === 'G' );
        self.APP.removeEnabled.set( type === 'I' );
    });

    // track the enabled/disabled status of the buttons
    self.autorun(() => {
        //console.debug( 'editEnabled', self.APP.editEnabled.get());
        //console.debug( 'deleteEnabled', self.APP.deleteEnabled.get());
    });

    // track the current selection
    self.autorun(() => {
        //console.debug( 'selected', self.APP.tree_selected.get());
    });
});

Template.groups_edit_dialog.onRendered( function(){
    const self = this;

    // whether we are running inside of a Modal
    self.autorun(() => {
        self.APP.isModal.set( self.$( '.c-groups-edit-dialog' ).parent().hasClass( 'modal-body' ));
    });

    // set the modal target
    self.autorun(() => {
        if( self.APP.isModal.get()){
            Modal.set({
                target: self.$( '.c-groups-edit-dialog' )
            });
        }
    });
});

Template.groups_edit_dialog.helpers({
    parmsButtons(){
        return {
            ...this,
           groups: Template.instance().APP.groups.get(),
           editEnabled: Boolean( Template.instance().APP.editEnabled.get()),
           deleteEnabled: Boolean( Template.instance().APP.deleteEnabled.get()),
           removeEnabled: Boolean( Template.instance().APP.removeEnabled.get())
        };
    },
    parmsTree(){
        return {
            ...this,
            groups: Template.instance().APP.groups.get()
        };
    }
});

Template.groups_edit_dialog.events({
    'tree-fns .c-groups-edit-dialog'( event, instance, data ){
        instance.APP.tree_getfn.set( data.fnGet );
    },

    'tree-rowselect .c-groups-edit-dialog'( event, instance, data ){
        instance.APP.tree_selected.set( data.node );
    },

    'click .js-new-item'( event, instance ){
        Modal.run({
            ...this,
            organization: instance.APP.organization.get(),
            targetDatabase: false,
            groupsRv: instance.APP.groups,
            mdBody: 'group_edit_dialog',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-lg',
            mdClassesContent: Meteor.APP.runContext.pageUIClasses().join( ' ' ),
            mdTitle: pwixI18n.label( I18N, 'groups.new.dialog_title' ),
            item: null
        });
        return false;
    },

    'click .js-edit-item'( event, instance ){
        const item = instance.APP.tree_selectedItem();
        Modal.run({
            ...this,
            organization: instance.APP.organization.get(),
            targetDatabase: false,
            groupsRv: instance.APP.groups,
            mdBody: 'group_edit_dialog',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-lg',
            mdClassesContent: Meteor.APP.runContext.pageUIClasses().join( ' ' ),
            mdTitle: pwixI18n.label( I18N, 'groups.edit.dialog_title' ),
            item: item
        });
    },

    'click .js-delete-item'( event, instance ){
        const item = instance.APP.deleteItem();
    },

    // submit
    //  event triggered in case of a modal
    'md-click .c-groups-edit-dialog'( event, instance, data ){
        //console.debug( event, data );
        if( data.button.id === Modal.C.Button.OK ){
            instance.$( event.currentTarget ).trigger( 'iz-submit' );
        }
    },

    // submit
    // rewrite the full tree
    'iz-submit .c-groups-edit-dialog'( event, instance ){
        const groups = instance.APP.getTree();
        const organizationId = instance.APP.organization.get().entity._id;
        const closeFn = function(){
            if( instance.APP.isModal.get()){
                Modal.close();
            } else {
                instance.$( '.NotesEdit' ).trigger( 'iz-clear-panel' );
            }
        }
        Meteor.callAsync( 'groups.upsert_tree', organizationId, groups )
            .then(() => {
                Tolert.success( pwixI18n.label( I18N, 'groups.edit.tree_edit_success' ));
                closeFn();
            })
            .catch(( e ) => {
                console.error( e );
                Tolert.error( pwixI18n.label( I18N, 'groups.edit.error' ));
            });
    }
});
