/*
 * /import/common/collections/providers/fieldset.js
 */

import { Field } from 'meteor/pwix:field';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import { Clients } from '/imports/common/collections/clients/index.js';

import { IIdent } from '/imports/common/interfaces/iident.iface.js';
import { IFeatured } from '/imports/common/interfaces/ifeatured.iface.js';
import { IRequires } from '/imports/common/interfaces/irequires.iface.js';

import { Providers } from './index.js';

Providers._dataset = null;
Providers._fieldset = null;
Providers._selected = new ReactiveVar( null );

/**
 * @locus Anywhere
 * @param {Object} client 
 * @returns {Array} the fieldset columns array
 */
Providers.dataSet = function( client ){
    if( Providers._dataset === null ){
        Providers._dataset = [];
        const selected = Clients.fn.selectedProviders( client );
        //console.debug( 'selected', selected );
        Providers.allProviders().forEach(( it ) => {
            let o = {};
            if( it instanceof IIdent ){
                o.id = it.identId();
                o.label = it.identLabel();
                o.description = it.identDescription();
                o.origin = it.identOrigin();
            }
            if( it instanceof IFeatured ){
                o.features = it.features().join( ', ' );
            }
            if( it instanceof IRequires ){
                o.requires = it.requires().join( ', ' );
            }
            o.selected = Object.keys( selected ).includes( o.id );
            Providers._dataset.push( o );
        });
    }
    //console.debug( this._dataset );
    return Providers._dataset;
};

/**
 * @locus Anywhere
 * @param {Object} client 
 * @returns 
 */
Providers.fieldSet = function( client=null ){
    if( Providers._fieldset === null ){
        Providers._selected.set( Clients.fn.selectedProviders( client ));
        let columns = [
            {
                name: 'id',
                dt_visible: false
            },
            {
                name: 'label',
                dt_type: 'string',
                dt_title: pwixI18n.label( I18N, 'clients.providers.list_label_th' )
            },
            {
                name: 'description',
                dt_visible: false
            },
            {
                name: 'origin',
                dt_visible: false
            },
            {
                name: 'features',
                dt_type: 'string',
                dt_title: pwixI18n.label( I18N, 'clients.providers.list_features_th' )
            },
            {
                name: 'requires',
                dt_visible: false
            },
            {
                name: 'selected',
                dt_type: 'string',
                dt_title: pwixI18n.label( I18N, 'clients.providers.list_selected_th' ),
                dt_className: 'dt-center',
                dt_template: Meteor.isClient && Template.provider_selection_checkbox,
                dt_templateContext( rowData ){
                    return {
                        client: client,
                        item: rowData,
                        selectedRv: Providers._selected
                    }
                }
            }
        ];
        Providers._fieldset = new Field.Set( columns );
    }
    return Providers._fieldset;
};
