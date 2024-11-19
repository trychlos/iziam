/*
 * /imports/client/components/authorizations_list/authorizations_list.js
 *
 * Display the authorizations of an organization.
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization as an entity with its DYN.records array
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - entityTabs
 * - recordTabs
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Permissions } from 'meteor/pwix:permissions';
import { pwixI18n } from 'meteor/pwix:i18n';
import { TenantsManager } from 'meteor/pwix:tenants-manager';
import { Tolert } from 'meteor/pwix:tolert';

import { Authorizations } from '/imports/common/collections/authorizations/index.js';

import '/imports/client/components/authorization_edit_dialog/authorization_edit_dialog.js';

import './authorizations_list.html';

Template.authorizations_list.helpers({
    // whether the current user has the permission to see the list of authorizations for the current organization
    canList(){
        const res = Permissions.isAllowed( 'feat.authorizations.list', this.item.get()._id );
        //console.debug( 'res', res );
        return res;
    },

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // this particular tabular instance
    tabularInstance(){
        const tabular = Authorizations.getTabular( this.item.get()._id );
        return tabular;
    }
});

Template.authorizations_list.events({
    // delete a authorization
    'tabular-delete-event .c-authorizations-list'( event, instance, data ){
        const label = data.item.label || data.item.DYN.computed_label || data.item._id;
        Meteor.callAsync( 'authorizations.removeById', this.item.get()._id, data.item._id )
            .then(( res ) => {
                Tolert.success( pwixI18n.label( I18N, 'authorizations.tabular.delete_success', label ));
            })
            .catch(( e ) => {
                Tolert.error({ type:e.error, message:e.reason });
            });
        return false; // doesn't propagate
    },

    // edit a authorization
    //  the buttons from tabular provide the entity document
    'tabular-edit-event .c-authorizations-list'( event, instance, data ){
        //console.debug( 'this', this, 'data', data );
        let dc = { ...this };
        delete dc.entityTabs;
        delete dc.entityTabsAfter;
        delete dc.recordTabs;
        delete dc.recordTabsAfter;
        delete dc.checker;
        dc.entity = this.item.get();
        const saved = TenantsManager.list.byEntity( this.item.get()._id );
        const item = saved.DYN.authorizations.byId( data.item._id );
        if( item ){
            Modal.run({
                ...dc,
                item,
                mdBody: 'authorization_edit_dialog',
                mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
                mdClasses: 'modal-lg',
                mdTitle: pwixI18n.label( I18N, 'authorizations.edit.edit_dialog_title', item.label || item.DYN.computed_label || item._id )
            });
        }
        return false;
    }
});
