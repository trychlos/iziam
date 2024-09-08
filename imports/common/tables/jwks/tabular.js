/*
 * /import/common/tables/jwks/collection.js
 */

import { Field } from 'meteor/pwix:field';
import { pwixI18n } from 'meteor/pwix:i18n';
import { Tabular } from 'meteor/pwix:tabular';

import { Jwks } from './index.js';

/**
 * @locus Anywhere
 * @param {Object} dc the data context of the jwks_list component
 * @returns {Array} the fieldset columns array
 */
Jwks.dataSet = function( dc ){
    let dataset = [];
    const jwks = dc.listGetFn( dc.args );
    jwks.forEach(( it ) => {
        let o = it;
        dataset.push( o );
    });
    return dataset;
};

/**
 * @locus Anywhere
 * @param {Object} dc the data context of the providers_list component
 * @returns 
 */
Jwks.fieldSet = function( dc ){
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
            dt_visible: false
        },
        {
            name: 'createdAt',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'jwks.list.created_at_th' )
        },
        {
            name: 'createdBy',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'jwks.list.created_by_th' )
        }
    ];
    const fieldset = new Field.Set( columns );
    return fieldset;
};

/**
 * @locus Anywhere
 * @summary Instanciates the Tabular.Table display to let an organization see and select the available providers
 *  This must be run in common code
 * @param {Object} dc the data context of the providers_list component
 * @returns {Tabular.Table} the list of providers which implement this type, which may be empty
 */
Jwks.tabular = function( dc ){
    return new Tabular.Table({
        name: 'Jwks',
        collection: null,
        data: Jwks.dataSet( dc ),
        columns: Jwks.fieldSet( dc ).toTabular(),
        serverSide: false,
        ajax: null,
        tabular: {
            withEditButton: false,
            withDeleteButton: false
        },
        destroy: true,
        order: {
            name: 'createdAt',
            dir: 'asc'
        },
    });
};
