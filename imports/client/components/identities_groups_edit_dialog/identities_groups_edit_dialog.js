/*
 * /imports/client/components/identities_groups_edit_dialog/identities_groups_edit_dialog.js
 *
 * Display the groups tree as an editable component with dnD and delete features.
 * 
 * +- <this>
 *     |
 *     +- groups_hierarchy_pane
 *         |
 *         +- groups_tree
 *         |
 *         +- groups_buttons
 *         |
 *         +-> trigger identities_select_dialog
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization as an entity with its DYN.records array
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Modal } from 'meteor/pwix:modal';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tabbed } from 'meteor/pwix:tabbed';

import '/imports/client/components/groups_buttons/groups_buttons.js';
import '/imports/client/components/groups_tree/groups_tree.js';
import '/imports/client/components/identities_groups_hierarchy_pane/identities_groups_hierarchy_pane.js';

import './identities_groups_edit_dialog.html';

Template.identities_groups_edit_dialog.onCreated( function(){
    const self = this;

    self.APP = {
        // whether we are running inside of a Modal
        isModal: new ReactiveVar( false ),
        // a deep copy of the organization groups
        groups: new ReactiveVar( [] ),
        // the entity tabbed
        tabbed: new Tabbed.Instance( self, { name: 'identities_groups_edit_dialog' }),
        // a function to get the tree content
        tree_getfn: new ReactiveVar( null ),
        // the tabs
        tabs: [
            {
                name: 'identities_groups_hierarchy_tab',
                navLabel: pwixI18n.label( I18N, 'groups.edit.hierarchy_tab_title' ),
                paneTemplate: 'identities_groups_hierarchy_pane'
            }
        ],

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
        }
    };

    // take a deep copy of the groups to be edited
    self.autorun(() => {
        const item = Template.currentData().item.get();
        const organization = TenantsManager.list.byEntity( item._id );
        if( organization ){
            self.APP.groups.set( _.cloneDeep( organization.DYN.identities_groups.get()));
        }
    });

    // initialize the Tabbed.Instance
    const dataContext = {
        ...Template.currentData(),
        groups: self.APP.groups
    };
    self.APP.tabbed.setTabbedParms({
        dataContext: dataContext,
        tabs: self.APP.tabs
    });
});

Template.identities_groups_edit_dialog.onRendered( function(){
    const self = this;

    // whether we are running inside of a Modal
    self.autorun(() => {
        self.APP.isModal.set( self.$( '.c-identities-groups-edit-dialog' ).parent().hasClass( 'modal-body' ));
    });

    // set the modal target
    self.autorun(() => {
        if( self.APP.isModal.get()){
            Modal.set({
                target: self.$( '.c-identities-groups-edit-dialog' )
            });
        }
    });
});

Template.identities_groups_edit_dialog.events({
    'tree-fns .c-identities-groups-hierarchy-pane'( event, instance, data ){
        instance.APP.tree_getfn.set( data.fnGet );
    },

    // submit
    //  event triggered in case of a modal
    'md-click .c-identities-groups-edit-dialog'( event, instance, data ){
        //console.debug( event, data );
        if( data.button.id === Modal.C.Button.OK ){
            instance.$( event.currentTarget ).trigger( 'iz-submit' );
        }
    },

    // submit
    // rewrite the full tree
    'iz-submit .c-identities-groups-edit-dialog'( event, instance ){
        const groups = instance.APP.getTree();
        const organizationId = this.item.get()._id;
        const closeFn = function(){
            if( instance.APP.isModal.get()){
                Modal.close();
            } else {
                instance.$( '.NotesEdit' ).trigger( 'iz-clear-panel' );
            }
        }
        Meteor.callAsync( 'identities_groups.upsert_tree', organizationId, groups )
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
