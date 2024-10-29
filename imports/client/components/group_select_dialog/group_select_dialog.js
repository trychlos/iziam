/*
 * /imports/client/components/group_select_dialog/group_select_dialog.js
 *
 * Acts as a standard select box, letting the user select a single (group) item of the tree.
 * 
 * Parms:
 * - organization: the Organization as an entity with its DYN.records array
 * - groups: the groups from the registrar
 * - selectedRv: a ReactiveVar where to get/set the newly selected group identifier
 */

import _ from 'lodash';

import '/imports/client/components/group_hierarchy_pane/group_hierarchy_pane.js';

import './group_select_dialog.html';

Template.group_select_dialog.onCreated( function(){
    const self = this;
    //console.debug( this );
    
    self.APP = {
        // whether we are running inside of a Modal
        isModal: new ReactiveVar( false ),
        // the entity tabbed
        tabbed: new Tabbed.Instance( self, { name: 'group_select_dialog' }),
        // the current tree selected node
        tree_selected: new ReactiveVar( null ),

        // return the selected item
        selectedItem(){
            const node = self.APP.tree_selected.get();
            return node ? node.original.doc : null;
        }
    };

    // initialize the Tabbed.Instance
    self.APP.tabbed.setTabbedParms({
        dataContext: Template.currentData(),
        tabs: [
            {
                name: 'group_hierarchy_tab',
                navLabel: pwixI18n.label( I18N, 'groups.edit.hierarchy_tab_title' ),
                paneTemplate: 'group_hierarchy_pane'
            }
        ]
    });

    // track the current selection
    self.autorun(() => {
        //console.debug( self.APP.selectedItem());
    });
});

Template.group_select_dialog.onRendered( function(){
    const self = this;

    // whether we are running inside of a Modal
    self.autorun(() => {
        self.APP.isModal.set( self.$( '.c-group-select-dialog' ).parent().hasClass( 'modal-body' ));
    });

    // set the modal target
    self.autorun(() => {
        if( self.APP.isModal.get()){
            Modal.set({
                target: self.$( '.c-group-select-dialog' )
            });
        }
    });
});

Template.group_select_dialog.events({
    // submit
    //  event triggered in case of a modal
    'md-click .c-group-select-dialog'( event, instance, data ){
        //console.debug( event, data );
        if( data.button.id === Modal.C.Button.OK ){
            instance.$( event.currentTarget ).trigger( 'iz-submit' );
        }
    },

    // submit
    // update the input/output ReactiveVar
    'iz-submit .c-group-select-dialog'( event, instance ){
        const rv = this.selectedRv;
        if( rv ){
            rv.set( instance.APP.selectedItem());
        }
        const closeFn = function(){
            if( instance.APP.isModal.get()){
                Modal.close();
            } else {
                instance.$( '.NotesEdit' ).trigger( 'iz-clear-panel' );
            }
        }
        closeFn();
    },

    'tree-rowselect .c-group-select-dialog'( event, instance, data ){
        instance.APP.tree_selected.set( data.node );
    }
});
