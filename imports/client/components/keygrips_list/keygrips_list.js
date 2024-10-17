/*
 * /imports/client/components/keygrips_list/keygrips_list.js
 *
 * Let the user manages its list of Keygrips.
 *
 * Parms:
 * - listGetFn: a function which returns the current list of JWKs for the caller
 * - listAddFn: a function which adds a JWK to the current list
 * - listRemoveFn: a function which removes a JWK from the current list
 * - args: an object to pass as an argument to above functions, with following keys:
 *   > caller, an { entity, record } object
 *   > parent, an { entity, record } object which may be null
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import { Keygrips } from '/imports/common/tables/keygrips/index.js';

//import '/imports/client/components/keygrip_edit_dialog/keygrip_edit_dialog.js';
//import '/imports/client/components/keygrip_view_button/keygrip_view_button.js';
//import '/imports/client/components/user_preferred_async/user_preferred_async.js';

import './keygrips_list.html';

Template.keygrips_list.onCreated( function(){
    const self = this;
    //console.debug( this );

    // get the data context and instanciate the tabular instance
    self.autorun(() => {
        const dataContext = Template.currentData();
        dataContext.withConstraints = ( dataContext.args.parent != null );
        Keygrips.tabular( dataContext );
    });
});

Template.keygrips_list.onRendered( function(){
    const self = this;

    // reactively redraw the table
    self.autorun(() => {
        self.$( '.TabularExt table.dataTable' ).DataTable().clear().rows.add( Keygrips.dataSet( Template.currentData())).draw();
    });
});

Template.keygrips_list.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    }
});

Template.keygrips_list.events({
    // delete a key
    'tabular-delete-event .c-keygrips-list'( event, instance, data ){
        this.listRemoveFn( this.args, data.item._id );
        return false; // doesn't propagate
    },

    // edit a keygrip
    'tabular-edit-event .c-keygrips-list'( event, instance, data ){
        //console.debug( this );
        Modal.run({
            ...this,
            mdBody: 'keygrip_edit_dialog',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-xl',
            mdClassesContent: Meteor.APP.runContext.pageUIClasses().join( ' ' ),
            mdTitle: pwixI18n.label( I18N, 'keygrips.edit.edit_dialog_title', data.item.label || data.item._id ),
            item: data.item
        });
        return false;
    }
});
