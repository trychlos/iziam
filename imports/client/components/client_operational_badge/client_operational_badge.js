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

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { TenantsManager } from 'meteor/pwix:tenants-manager';

import './client_operational_badge.html';

Template.client_operational_badge.onCreated( function(){
    const self = this;

    self.APP = {
        // user has clicked on the status button of the client line
        // arg is an object with following keys:
        // - type: the FieldStatus status
        onClick(){
            console.debug( 'onClick', arguments );
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
});
