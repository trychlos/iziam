/*
 * /imports/client/components/resources_list/resources_list.js
 *
 * Display the resources of an organization.
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

import { Resources } from '/imports/common/collections/resources/index.js';

import '/imports/client/components/resource_edit_dialog/resource_edit_dialog.js';

import './resources_list.html';

Template.resources_list.helpers({
    // whether the current user has the permission to see the list of resources for the current organization
    canList(){
        const res = Permissions.isAllowed( 'feat.resources.list', this.item.get()._id );
        //console.debug( 'res', res );
        return res;
    },

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // this particular tabular instance
    tabularInstance(){
        const tabular = Resources.getTabular( this.item.get()._id );
        return tabular;
    }
});

Template.resources_list.events({
    // delete a resource - this will delete all the validity records too
    'tabular-delete-event .c-resources-list'( event, instance, data ){
        const label = data.item.label || data.item.name;
        Meteor.callAsync( 'resources.removeById', this.item.get()._id, data.item._id )
            .then(( res ) => {
                Tolert.success( pwixI18n.label( I18N, 'resources.tabular.delete_success', label ));
            })
            .catch(( e ) => {
                Tolert.error({ type:e.error, message:e.reason });
            });
        return false; // doesn't propagate
    },

    // edit a resource
    //  the buttons from tabular provide the entity document
    'tabular-edit-event .c-resources-list'( event, instance, data ){
        let dc = { ...this };
        delete dc.entityTabs;
        delete dc.entityTabsAfter;
        delete dc.recordTabs;
        delete dc.recordTabsAfter;
        delete dc.checker;
        dc.entity = this.item.get();
        const saved = TenantsManager.list.byEntity( this.item.get()._id );
        const item = saved.DYN.resources.byId( data.item._id );
        if( item ){
            Modal.run({
                ...dc,
                item,
                mdBody: 'resource_edit_dialog',
                mdButtons: [ Modal.C.Button.CANCEL, Modal.C.Button.OK ],
                mdClasses: 'modal-lg',
                mdClassesContent: Meteor.APP.runContext.pageUIClasses().join( ' ' ),
                mdTitle: pwixI18n.label( I18N, 'resources.edit.modal_title', item.label || item.name )
            });
        }
        return false;
    }
});
