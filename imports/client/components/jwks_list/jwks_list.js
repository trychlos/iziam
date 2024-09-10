/*
 * /imports/client/components/jwks_list/jwks_list.js
 *
 * Let the user manages its list of JWK.
 * This component is used both for an organization and for a client.
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

import { Jwks } from '/imports/common/tables/jwks/index.js';

import '/imports/client/components/jwk_edit_dialog/jwk_edit_dialog.js';
import '/imports/client/components/jwk_view_button/jwk_view_button.js';
import '/imports/client/components/user_preferred_async/user_preferred_async.js';

import './jwks_list.html';

Template.jwks_list.onCreated( function(){
    const self = this;
    //console.debug( this );

    // get the data context and instanciate the tabular instance
    self.autorun(() => {
        const dataContext = Template.currentData();
        dataContext.withConstraints = ( dataContext.args.parent != null );
        Jwks.tabular( dataContext );
    });
});

Template.jwks_list.onRendered( function(){
    const self = this;

    // reactively redraw the table
    self.autorun(() => {
        self.$( '.TabularExt table.dataTable' ).DataTable().clear().rows.add( Jwks.dataSet( Template.currentData())).draw();
    });
});

Template.jwks_list.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    }
});

Template.jwks_list.events({
    // delete a key
    'tabular-delete-event .c-jwks-list'( event, instance, data ){
        this.listRemoveFn( this.args, data.item.id );
        return false; // doesn't propagate
    },

    // edit a key
    'tabular-edit-event .c-jwks-list'( event, instance, data ){
        Modal.run({
            ...data.table.arg( 'dataContext'),
            mdBody: 'jwk_edit_dialog',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-lg',
            mdClassesContent: Meteor.APP.runContext.pageUIClasses().join( ' ' ),
            mdTitle: pwixI18n.label( I18N, 'jwks.edit.edit_dialog_title', data.item.label || data.item.id ),
            item: data.item
        });
    }
});
