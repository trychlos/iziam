/*
 * /imports/collections/clients_entities/fieldset.js
 *
 * The clients registered with an organization.
 */

import { Field } from 'meteor/pwix:field';
import { Notes } from 'meteor/pwix:notes';
import { pwixI18n } from 'meteor/pwix:i18n';
import { Tracker } from 'meteor/tracker';
import { Validity } from 'meteor/pwix:validity';

import { ClientsEntities } from './index.js';

const _defaultFieldSet = function(){
    let columns = [
        // the organization entity
        // mandatory
        {
            name: 'organization',
            type: String,
            dt_title: pwixI18n.label( I18N, 'clients.list.organization_th' )
        },
        // common notes
        Notes.fieldDef(),
        // timestampable behaviour
        Timestampable.fieldDef(),
        // validity fieldset,
        Validity.entitiesFieldDef()
    ];
    return columns;
};

Tracker.autorun(() => {
    let columns = _defaultFieldSet( conf );
    let fieldset = new Field.Set( columns );
    // update the fieldSet definitions to display start and end effect dates
    let def = fieldset.byName( 'effectStart' );
    if( def ){
        def.set({
            dt_visible: true,
            dt_title: pwixI18n.label( I18N, 'clients.list.effect_start_th' ),
            dt_templateContext( rowData ){
                return {
                    date: rowData.effectStart
                };
            }
        });
    }
    def = fieldset.byName( 'effectEnd' );
    if( def ){
        def.set({
            dt_visible: true,
            dt_title: pwixI18n.label( I18N, 'clients.list.effect_end_th' ),
            dt_templateContext( rowData ){
                return {
                    date: rowData.effectEnd
                };
            }
        });
    }
    ClientsEntities.fieldSet.set( fieldset );
});
