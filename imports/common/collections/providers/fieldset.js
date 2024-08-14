/*
 * /import/common/collections/providers/fieldset.js
 */

import { Field } from 'meteor/pwix:field';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';

import { IIdent } from '/imports/common/interfaces/iident.iface.js';
import { IFeatured } from '/imports/common/interfaces/ifeatured.iface.js';
import { IRequires } from '/imports/common/interfaces/irequires.iface.js';

import { Providers } from './index.js';

Providers._dataset = null;
Providers._fieldset = null;
Providers._selected = new ReactiveVar( null );

/**
 * @locus Anywhere
 * @param {Object} caller either a client or an organization as an object { entity, record }
 * @param {Function} selectedProviders a function which returns the currently selected providers
 * @returns {Array} the fieldset columns array
 */
Providers.dataSet = function( caller, selectedProviders ){
    if( Providers._dataset === null ){
        Providers._dataset = [];
        const selected = selectedProviders ? selectedProviders( caller ) : [];
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
 * @param {Object} caller either a client { entity, record } or an organization { entity, record }
 * @param {Function} selectedProviders a function which returns the currently selected providers
 * @returns 
 */
Providers.fieldSet = function( caller, selectedProviders ){
    if( Providers._fieldset === null ){
        Providers._selected.set( selectedProviders ? selectedProviders( caller ) : [] );
        let columns = [
            {
                name: 'id',
                dt_visible: false
            },
            {
                name: 'label',
                dt_type: 'string',
                dt_title: pwixI18n.label( I18N, 'providers.list.label_th' )
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
                dt_title: pwixI18n.label( I18N, 'providers.list.features_th' )
            },
            {
                name: 'requires',
                dt_visible: false
            },
            {
                name: 'selected',
                dt_type: 'string',
                dt_title: pwixI18n.label( I18N, 'providers.list.selected_th' ),
                dt_className: 'dt-center',
                dt_template: Meteor.isClient && Template.provider_selection_checkbox,
                dt_templateContext( rowData ){
                    return {
                        caller: caller,
                        item: rowData,
                        selectedRv: Providers._selected,
                        selectedProviders: selectedProviders
                    }
                }
            }
        ];
        Providers._fieldset = new Field.Set( columns );
    }
    return Providers._fieldset;
};
