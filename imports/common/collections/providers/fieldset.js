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

/**
 * @locus Anywhere
 * @param {Object} dc the data context of the providers_list component
 * @returns {Array} the fieldset columns array
 */
Providers.dataSet = function( dc ){
    let dataset = [];
    const selected = dc.selectedProvidersGetFn ? dc.selectedProvidersGetFn( dc.args ) : [];
    const base = dc.baseProvidersFn ? dc.baseProvidersFn( dc.args ) : [];
    base.forEach(( it ) => {
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
        dataset.push( o );
    });
    //console.debug( 'dataset', dataset );
    return dataset;
};

/**
 * @locus Anywhere
 * @param {Object} dc the data context of the providers_list component
 * @returns 
 */
Providers.fieldSet = function( dc ){
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
                    ...dc,
                    item: rowData
                }
            },
            dt_width: '100px'
        }
    ];
    const fieldset = new Field.Set( columns );
    return fieldset;
};
