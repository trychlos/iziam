/*
 * /imports/client/components/client_export_button/client_export_button.js
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

import { pwixI18n } from 'meteor/pwix:i18n';
import { TenantsManager } from 'meteor/pwix:tenants-manager';

import { Exporter } from '/imports/common/helpers/exporter.js';

import './client_export_button.html';

Template.client_export_button.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // the button title
    title(){
        return pwixI18n.label( I18N, 'clients.tabular.export_button_title', this.item.label );
    }
});

Template.client_export_button.events({
    'click .js-btn'( event, instance ){
        const organization = TenantsManager.list.byEntity( this.item.DYN.entity.organization );
        const client = organization ? organization.DYN.clients.byId( this.item.entity ) : null;
        if( client ){
            Exporter.run( client, {
                id: 'iziam_export',
                suggestedName: 'client_'+client._id+'.json'
            });
        }
    }
});
