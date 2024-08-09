/*
 * /import/common/collections/providers/fieldset.js
 */

import { Field } from 'meteor/pwix:field';
import { pwixI18n } from 'meteor/pwix:i18n';

import { Organizations } from '/imports/common/collections/organizations/index.js';

import { IIdent } from '/imports/common/interfaces/iident.iface.js';
import { IFeatured } from '/imports/common/interfaces/ifeatured.iface.js';
import { IRequires } from '/imports/common/interfaces/irequires.iface.js';

import { Providers } from './index.js';

Providers._dataset = null;
Providers._fieldset = null;

/**
 * @locus Anywhere
 * @param {Object} tenant 
 * @returns {Array} the fieldset columns array
 */
Providers.dataSet = function( tenant ){
    if( Providers._dataset === null ){
        Providers._dataset = [];
        const selected = Organizations.selectedProvidersIds( tenant );
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
 * @param {Object} tenant 
 * @returns 
 */
Providers.fieldSet = function( tenant=null ){
    if( Providers._fieldset === null ){
        const selected = Organizations.selectedProvidersIds( tenant );
        const features = Providers.featuresByIds( Object.keys( selected ));
        let columns = [
            {
                name: 'id',
                dt_visible: false
            },
            {
                name: 'label',
                dt_type: 'string',
                dt_title: pwixI18n.label( I18N, 'organizations.providers.list_label_th' )
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
                dt_title: pwixI18n.label( I18N, 'organizations.providers.list_features_th' )
            },
            {
                name: 'requires',
                dt_visible: false
            },
            {
                name: 'selected',
                dt_type: 'string',
                dt_title: pwixI18n.label( I18N, 'organizations.providers.list_selected_th' ),
                dt_className: 'dt-center',
                dt_template: 'dt_checkbox',
                dt_templateContext( rowData ){
                    return {
                        organization: tenant,
                        item: rowData,
                        // the provider can be selected (i.e. is enabled) if all its requirements are already selected and it is itself user selectable
                        enabled: ( dataContext ) => {
                            const provider = Providers.byId( dataContext.item.id );
                            let enabled = false;
                            if( provider ){
                                enabled = provider.userSelectable();
                                if( enabled ){
                                    provider.requires().every(( req ) => {
                                        enabled &&= features.includes( req );
                                        return enabled;
                                    });
                                }
                            } else {
                                console.warn( 'unable to get a provider for id='+dataContext.item.id );
                            }
                            return enabled;
                        }
                    }
                }
            }
        ];
        Providers._fieldset = new Field.Set( columns );
    }
    return Providers._fieldset;
};
