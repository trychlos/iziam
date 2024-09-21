/*
 * /import/common/tables/jwks/tabular.js
 */

import strftime from 'strftime';

import { Field } from 'meteor/pwix:field';
import { pwixI18n } from 'meteor/pwix:i18n';
import { Tabular } from 'meteor/pwix:tabular';

import { JwaAlg } from '/imports/common/definitions/jwa-alg.def.js';
import { JwkUse } from '/imports/common/definitions/jwk-use.def.js';

import { Jwks } from './index.js';

/**
 * @locus Anywhere
 * @param {Object} dc the data context of the jwks_list component
 * @returns {Array} the fieldset columns array
 *  A reactive data source
 */
Jwks.dataSet = function( dc ){
    let dataset = [];
    const jwks = dc.listGetFn( dc.args );
    jwks.forEach(( it ) => {
        let o = it;
        dataset.push( o );
    });
    console.debug( 'dataset', dataset.length, dataset );
    return dataset;
};

/**
 * @locus Anywhere
 * @param {Object} dc the data context of the providers_list component
 * @returns 
 */
Jwks.tabularFieldSet = function( dc ){
    let columns = [
        {
            name: 'id',
            dt_visible: false
        },
        {
            name: 'label',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'jwks.list.label_th' )
        },
        {
            name: 'use',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'jwks.list.use_th' ),
            dt_render( data, type, rowData ){
                return type === 'display' ? JwkUse.label( JwkUse.byId( rowData.use )) : rowData.use;
            }
        },
        {
            name: 'kid',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'jwks.list.kid_th' ),
            dt_render( data, type, rowData ){
                return rowData.kid || '';
            }
        },
        {
            name: 'alg',
            dt_type: 'string',
            dt_className: 'ui-nowrap',
            dt_title: pwixI18n.label( I18N, 'jwks.list.alg_th' ),
            dt_render( data, type, rowData ){
                return type === 'display' ? JwaAlg.label( JwaAlg.byId( rowData.alg )) : rowData.alg;
            }
        },
        {
            name: 'startingAt',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'jwks.list.starting_th' ),
            dt_render( data, type, rowData ){
                return rowData.startingAt ? strftime( '%Y-%m-%d', rowData.startingAt ) : null;
            }
        },
        {
            name: 'endingAt',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'jwks.list.ending_th' ),
            dt_render( data, type, rowData ){
                return rowData.endingAt ? strftime( '%Y-%m-%d', rowData.endingAt ) : null;
            }
        },
        {
            name: 'createdAt',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'jwks.list.created_at_th' ),
            dt_render( data, type, rowData ){
                return strftime( '%Y-%m-%d %H:%M:%S', rowData.createdAt );
            }
        },
        {
            name: 'createdBy',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'jwks.list.created_by_th' ),
            dt_template: Meteor.isClient && Template.user_preferred_async,
            dt_templateContext( rowData ){
                return {
                    userId: rowData.createdBy
                };
            }
        }
    ];
    const fieldset = new Field.Set( columns );
    return fieldset;
};

/**
 * @locus Anywhere
 * @summary Instanciates the Tabular.Table display to let an organization manages its JWKS
 *  This must be run in common code
 * @param {Object} dc the data context of the providers_list component
 */
Jwks.tabular = function( dc ){
    new Tabular.Table({
        name: 'Jwks',
        collection: null,
        data: Jwks.dataSet( dc ),
        columns: Jwks.tabularFieldSet( dc ).toTabular(),
        serverSide: false,
        ajax: null,
        tabular: {
            withInfoButton: false,
            async deleteButtonTitle( it ){
                return pwixI18n.label( I18N, 'jwks.list.delete_title', it.label || it.id );
            },
            async deleteConfirmationText( it ){
                return pwixI18n.label( I18N, 'jwks.list.delete_confirm_text', it.label || it.id );
            },
            async deleteConfirmationTitle( it ){
                return pwixI18n.label( I18N, 'jwks.list.delete_confirm_title', it.label || it.id );
            },
            async editButtonTitle( it ){
                return pwixI18n.label( I18N, 'jwks.list.edit_title', it.label || it.id );
            },
            dataContext: dc
        },
        destroy: true,
        order: {
            name: 'createdAt',
            dir: 'asc'
        },
    });
};
