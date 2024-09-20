/*
 * /imports/client/components/client_secrets_list/client_secrets_list.js
 *
 * Let the client manages its list of secrets.
 *
 * Parms:
 * - listGetFn: a function which returns the current list of secrets for the caller
 * - listAddFn: a function which adds a secret to the current list
 * - listRemoveFn: a function which removes a secret from the current list
 * - args: an object to pass as an argument to above functions, with following keys:
 *   > caller, an { entity, record } object
 *   > parent, an { entity, record } object which may be null
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import { ClientSecrets } from '/imports/common/tables/client_secrets/index.js';

import '/imports/client/components/user_preferred_async/user_preferred_async.js';

import './client_secrets_list.html';

Template.client_secrets_list.onCreated( function(){
    const self = this;
    //console.debug( this );

    // get the data context and instanciate the tabular instance
    self.autorun(() => {
        const dataContext = Template.currentData();
        dataContext.withConstraints = ( dataContext.args.parent != null );
        ClientSecrets.tabular( dataContext );
    });
});

Template.client_secrets_list.onRendered( function(){
    const self = this;

    // reactively redraw the table
    self.autorun(() => {
        self.$( '.TabularExt table.dataTable' ).DataTable().clear().rows.add( ClientSecrets.dataSet( Template.currentData())).draw();
    });
});

Template.client_secrets_list.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    }
});

Template.client_secrets_list.events({
    // delete a key
    'tabular-delete-event .c-client-secrets-list'( event, instance, data ){
        this.listRemoveFn( this.args, data.item.id );
        return false; // doesn't propagate
    },

    // edit a keygrip
    'tabular-edit-event .c-client-secrets-list'( event, instance, data ){
        console.debug( this );
        Modal.run({
            ...this,
            mdBody: 'client_secret_edit_dialog',
            mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
            mdClasses: 'modal-lg',
            mdClassesContent: Meteor.APP.runContext.pageUIClasses().join( ' ' ),
            mdTitle: pwixI18n.label( I18N, 'clients.secrets.edit.edit_dialog_title', data.item.label || data.item.id ),
            item: data.item
        });
        return false;
    }
});
