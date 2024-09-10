/*
 * /imports/client/components/jwk_view_button/jwk_view_button.js
 *
 * Open the jwk_edit_dialog for viewing the jwk.
 * 
 * NB: this is no more needed as soon as we accept to edit the key label of the key ID.
 *
 * Parms:
 * - item: the to-be-viewed jwk
 * - table
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

import './jwk_view_button.html';

Template.jwk_view_button.helpers({
    title(){
        return pwixI18n.label( I18N, 'jwks.edit.view_button_title', this.item.label || this.item.id )
    }
});

Template.jwk_view_button.events({
    // the Tabular.Table has kept the instanciation data context. We can so get it back here
    'click .js-view'( event, instance ){
        Modal.run({
            ...this.table.arg( 'dataContext'),
            mdBody: 'jwk_edit_dialog',
            mdButtons: [ Modal.C.Button.CLOSE ],
            mdClasses: 'modal-lg',
            mdClassesContent: Meteor.APP.runContext.pageUIClasses().join( ' ' ),
            mdTitle: pwixI18n.label( I18N, 'jwks.edit.view_dialog_title', this.item.label || this.item.id ),
            item: this.item
        });
        return false;
    }
});
