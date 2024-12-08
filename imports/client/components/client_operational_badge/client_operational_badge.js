/*
 * /imports/client/components/client_operational_badge/client_operational_badge.js
 *
 * This component is used to display the operational status of the client in the tabular display.
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

import './client_operational_badge.html';

Template.client_operational_badge.onCreated( function(){
    const self = this;

    self.APP = {
        // user has clicked on the status button of the client line
        // arg is an object with following keys:
        // - type: the FieldStatus status
        onClick(){
            const item = self.data.item;
            if( item.DYN && item.DYN.entity ){
                const organization = TenantsManager.list.byEntity( item.DYN.entity.organization );
                Modal.run({
                    entityId: item.DYN.entity._id,
                    organization: Validity.getEntityRecord( organization ),
                    mdBody: 'operational_dialog',
                    mdButtons: [ Modal.C.Button.CLOSE ],
                    mdClasses: 'modal-lg',
                    mdTitle: pwixI18n.label( I18N, 'clients.tabular.operational_dialog_title' )
                });
            } else {
                console.debug( 'no DYN or entity in tabular item', item );
            }
        }
    };
});

Template.client_operational_badge.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // the status
    parmsStatus(){
        if( this.item.DYN?.entity?.organization ){
            const organization = TenantsManager.list.byEntity( this.item.DYN.entity.organization );
            const clientId = this.item.DYN.entity._id;
            const statusRv = organization && clientId ? organization.DYN.clients?.byId( clientId )?.DYN.operational?.status : null;
            const title = statusRv && statusRv.get() === Forms.FieldStatus.C.VALID ?
                pwixI18n.label( I18N, 'clients.tabular.operational_valid_title' ) : pwixI18n.label( I18N, 'clients.tabular.operational_invalid_title' );
            return {
                statusRv: statusRv,
                title: title,
                uncompleteButton: true,
                invalidButton: true,
                buttonOnClick: Template.instance().APP.onClick
            };
        }
    }
});
