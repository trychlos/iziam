/*
 * /imports/common/collections/clients/fieldset.js
 *
 * Define here the fields to be published and/or rendered in the tabular display.
 */

import { Field } from 'meteor/pwix:field';
import { Notes } from 'meteor/pwix:notes';
import { pwixI18n } from 'meteor/pwix:i18n';
import { Tracker } from 'meteor/tracker';
import { Validity } from 'meteor/pwix:validity';

import { YesNo } from '/imports/common/definitions/yesno.def.js';

import { Clients } from './index.js';

const _defaultFieldSet = function(){
    let columns = [
        // a mandatory label, identifies the client
        {
            name: 'label',
            schema: false,
            dt_title: pwixI18n.label( I18N, 'clients.tabular.label_th' )
        },
        // whether the client is invalid
        {
            name: 'enabled',
            schema: false,
            dt_title: pwixI18n.label( I18N, 'clients.tabular.enabled_th' ),
            dt_className: 'dt-center',
            dt_render( data, type, rowData ){
                return YesNo.label( rowData.enabled, { default: true });
            }
        },
        // entity notes in tabular display
        {
            name: 'entity_notes',
            schema: false,
            dt_title: pwixI18n.label( I18N, 'clients.tabular.entity_notes_th' ),
            dt_className: 'dt-center',
            dt_template: Meteor.isClient && Template.dt_entity_notes
        },
        // client type
        {
            name: 'client_type',
            schema: false,
            dt_title: pwixI18n.label( I18N, 'clients.tabular.client_type_th' ),
        },
        // application type
        {
            name: 'application_type',
            schema: false,
            dt_title: pwixI18n.label( I18N, 'clients.tabular.application_type_th' ),
        },
        // authorization flow
        {
            name: 'authorization_flow',
            schema: false,
            dt_className: 'ui-nowrap',
            dt_title: pwixI18n.label( I18N, 'clients.tabular.authorization_flow_th' ),
        },
        // authentication method
        {
            name: 'auth_method',
            schema: false,
            dt_className: 'ui-nowrap',
            dt_title: pwixI18n.label( I18N, 'clients.tabular.auth_method_th' ),
        },
        Notes.fieldDef(),
        Validity.recordsFieldDef(),
        Timestampable.fieldDef(),
        {
            name: 'DYN',
            dt_visible: false
        }
    ];
    return columns;
};

Tracker.autorun(() => {
    let columns = _defaultFieldSet();
    let fieldset = new Field.Set( columns );
    // update the fieldSet definitions to display start and end effect dates
    let def = fieldset.byName( 'effectStart' );
    if( def ){
        def.set({
            dt_visible: true,
            dt_title: pwixI18n.label( I18N, 'validity.list.effect_start_th' ),
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
            dt_title: pwixI18n.label( I18N, 'validity.list.effect_end_th' ),
            dt_templateContext( rowData ){
                return {
                    date: rowData.effectEnd
                };
            }
        });
    }
    Clients.fieldSet.set( fieldset );
});
