/*
 * /imports/client/components/keygrip_secrets_list/keygrip_secrets_list.js
 *
 * Let the user manages its list of Keygrip Secrets.
 *
 * Parms:
 * - listGetFn: a function which returns the current list of keygrip secrets for the caller
 * - listAddFn: a function which adds a keygrip secret to the current list
 * - listRemoveFn: a function which removes a keygrip secret from the current list
 * - args: an object to pass as an argument to above functions, with following keys:
 *   > caller, an { entity, record } organization
 *   > parent, an { entity, record } object which may be null
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import { KeygripSecrets } from '/imports/common/tables/keygrip_secrets/index.js';

import './keygrip_secrets_list.html';

Template.keygrip_secrets_list.onCreated( function(){
    const self = this;
    //console.debug( this );

    // get the data context and instanciate the tabular instance
    self.autorun(() => {
        const dataContext = Template.currentData();
        dataContext.withConstraints = ( dataContext.args.parent != null );
        KeygripSecrets.tabular( dataContext );
    });
});

Template.keygrip_secrets_list.onRendered( function(){
    const self = this;

    // reactively redraw the table
    self.autorun(() => {
        self.$( '.TabularExt table.dataTable' ).DataTable().clear().rows.add( KeygripSecrets.dataSet( Template.currentData())).draw();
    });
});

Template.keygrip_secrets_list.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    }
});

Template.keygrip_secrets_list.events({
    // delete a key
    'tabular-delete-event .c-keygrip-secrets-list'( event, instance, data ){
        this.listRemoveFn( this.args, data.item._id );
        // reactively update the keygrip
        const item = this.item.get();
        this.item.set( item );
        return false; // doesn't propagate
    },

    // edit a key (i.e. label and expiration)
    'tabular-edit-event .c-keygrip-secrets-list'( event, instance, data ){
        //console.debug( this );
        Modal.run({
            ...this,
            mdBody: 'keygrip_secret_edit_dialog',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-lg',
            mdClassesContent: Meteor.APP.runContext.pageUIClasses().join( ' ' ),
            mdTitle: pwixI18n.label( I18N, 'keygrips.edit.secret_edit_dialog_title', data.item.label || data.item._id ),
            item: data.item
        });
        return false;
    }
});
