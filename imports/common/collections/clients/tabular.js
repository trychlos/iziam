/*
 * /imports/common/collections/clients/tabular.js
 *
 * This tabular displays the closest record for each client, but:
 * - lowest start end highest end effect dates are displayed
 * - a particular class is used when the value is not the same among all the records
 * - a badge is added when there is more than one record
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Permissions } from 'meteor/pwix:permissions';
import { pwixI18n } from 'meteor/pwix:i18n';
import { Tabular } from 'meteor/pwix:tabular';
import { Tracker } from 'meteor/tracker';

import { ClientsEntities } from '/imports/common/collections/clients_entities/index.js';
import { ClientsRecords } from '/imports/common/collections/clients_records/index.js';

import { Clients } from './index.js';

const _entity = async function( data ){
    const entity = Meteor.isClient ?
        await Meteor.callAsync( 'clients_entities_getBy', data.DYN.entity.organization, { _id: data.entity }) : await ClientsEntities.s.getBy( data.DYN.entity.organization, { _id: data.entity });
    return entity[0];
};

const _record_label = function( it ){
    return it ? it.label : '';
};

Tracker.autorun(() => {
    // build the defined columns indexed by name
    let columns = {};
    let i = 0;
    Clients.fieldSet.get().names().forEach(( it ) => {
        columns[it] = {
            def: Clients.fieldSet.get().byName( it ),
            index: i
        };
        i += 1;
    });

    // instanciates the tabular Table
    Clients.tabular = new Tabular.Table({
        name: 'Clients',
        collection: ClientsRecords.collection,
        columns: Clients.fieldSet.get().toTabular(),
        pub: 'clientsTabularLast',
        tabular: {
            // have a badge which displays the count of validity records if greater than 1
            // have a badge which displays the operational status of the client
            async buttons( it ){
                return [
                    {
                        where: Tabular.C.Where.BEFORE,
                        buttons: [
                            'ValidityCountBadge'
                        ]
                    },
                    {
                        where: Tabular.C.Where.AFTER,
                        buttons: [
                            'client_operational_badge'
                        ]
                    }
                ];
            },
            // it: the displayed closest record
            async deleteButtonEnabled( it ){
                return Permissions.isAllowed( 'feat.clients.delete', Meteor.isClient && Meteor.userId(), it._id );
            },
            // display the organization label instead of the identifier in the button title
            async deleteButtonTitle( it ){
                return pwixI18n.label( I18N, 'clients.tabular.delete_button_title', _record_label( it ));
            },
            async deleteConfirmationText( it ){
                return pwixI18n.label( I18N, 'clients.delete.confirmation_text', _record_label( it ));
            },
            async deleteConfirmationTitle( it ){
                return pwixI18n.label( I18N, 'clients.delete.confirmation_title', _record_label( it ));
            },
            async editButtonTitle( it ){
                return pwixI18n.label( I18N, 'clients.tabular.edit_button_title', _record_label( it ));
            },
            async editItem( it ){
                return await _entity( it );
            },
            async infoButtonTitle( it ){
                return pwixI18n.label( I18N, 'clients.tabular.info_button_title', _record_label( it ));
            },
            async infoItem( it ){
                return await _entity( it );
            },
            async infoModalTitle( it ){
                return pwixI18n.label( I18N, 'clients.tabular.info_modal_title', _record_label( it ));
            },
        },
        destroy: true,
        order: [[ 0, 'asc' ]],
        // the publication takes care of providing the list of fields which have not the same value among all records
        createdRow( row, data, dataIndex, cells ){
            //console.debug( 'data', data, 'columns', columns );
            // set a different display when a value changes between validity records
            data.DYN.analyze.diffs.forEach(( it ) => {
                if( columns[it] ){
                    const def = columns[it].def;
                    if( def && def.tabular !== false && def.dt_visible !== false ){
                        $( cells[columns[it].index] ).addClass( 'dt-different' );   
                    }
                } else {
                    // a column has changed but is not displayed in the tabular
                }
            });
        }
    });
});
