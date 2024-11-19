/*
 * /imports/client/components/organization_operational_badge/organization_operational_badge.js
 *
 * This component is used to display the operational status of the organization in the tabular display.
 * 
 * Data context:
 * - item: the item as provided to the tabular display (i.e. a modified closest record)
 *      with DYN { analyze, entity, records }
 * - table: the Tabular.Table instance
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Forms } from 'meteor/pwix:forms';
import { Modal } from 'meteor/pwix:modal';
import { pwixI18n } from 'meteor/pwix:i18n';
import { TenantsManager } from 'meteor/pwix:tenants-manager';

import '/imports/client/components/operational_dialog/operational_dialog.js';

import './organization_operational_badge.html';

Template.organization_operational_badge.onCreated( function(){
    const self = this;

    self.APP = {
        // user has clicked on the status button of the organization line
        // arg is an object with following keys:
        // - type: the FieldStatus status
        onClick(){
            const item = self.data.item;
            if( item.DYN && item.DYN.entity ){
                Modal.run({
                    entityId: item.DYN.entity._id,
                    mdBody: 'operational_dialog',
                    mdButtons: [ Modal.C.Button.CLOSE ],
                    mdClasses: 'modal-lg',
                    mdTitle: pwixI18n.label( I18N, 'organizations.tabular.operational_dialog_title' )
                });
            } else {
                console.debug( 'no DYN or entity in tabular item', item );
            }
        }
    };
});

Template.organization_operational_badge.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // the status
    parmsStatus(){
        const entity = this.item.entity ? TenantsManager.list.byEntity( this.item.entity ) : null;
        const statusRv = entity ? entity.DYN.operational?.status : null;
        const title = statusRv && statusRv.get() === Forms.FieldStatus.C.VALID ?
            pwixI18n.label( I18N, 'organizations.tabular.operational_valid_title' ) : pwixI18n.label( I18N, 'organizations.tabular.operational_invalid_title' );
        return statusRv ? {
            statusRv: statusRv,
            title: title,
            uncompleteButton: true,
            invalidButton: true,
            buttonOnClick: Template.instance().APP.onClick
        } : null;
    }
});
