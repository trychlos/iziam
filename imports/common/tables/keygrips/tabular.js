/*
 * /import/common/tables/keygrips/tabular.js
 */

import strftime from 'strftime';

import { Field } from 'meteor/pwix:field';
import { pwixI18n } from 'meteor/pwix:i18n';
import { Tabular } from 'meteor/pwix:tabular';

import { HmacAlg } from '/imports/common/definitions/hmac-alg.def.js';
import { HmacEncoding } from '/imports/common/definitions/hmac-encoding.def.js';

import { Keygrips } from './index.js';

/**
 * @locus Anywhere
 * @param {Object} dc the data context of the keygrips_list component
 * @returns {Array} the fieldset columns array
 *  A reactive data source
 */
Keygrips.dataSet = function( dc ){
    let dataset = [];
    const keygrips = dc.listGetFn( dc.args );
    keygrips.forEach(( it ) => {
        let o = it;
        dataset.push( o );
    });
    //console.debug( 'dataset', dataset.length, dataset );
    return dataset;
};

/**
 * @locus Anywhere
 * @param {Object} dc the data context of the providers_list component
 * @returns 
 */
Keygrips.fieldSet = function( dc ){
    let columns = [
        {
            name: 'id',
            dt_visible: false
        },
        {
            name: 'label',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'keygrips.list.label_th' )
        },
        {
            name: 'alg',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'keygrips.list.alg_th' ),
            dt_render( data, type, rowData ){
                return strftime( '%Y-%m-%d %H:%M:%S', rowData.expireAt );
            }
        },
        {
            name: 'encoding',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'keygrips.list.encoding_th' ),
            dt_render( data, type, rowData ){
                return strftime( '%Y-%m-%d %H:%M:%S', rowData.expireAt );
            }
        },
        {
            name: 'lastCreated',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'keygrips.list.last_created_th' ),
            dt_render( data, type, rowData ){
                return strftime( '%Y-%m-%d %H:%M:%S', rowData.lastCreated );
            }
        },
        {
            name: 'lastExpiration',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'keygrips.list.last_expiration_th' ),
            dt_template: Meteor.isClient && Template.user_preferred_async,
            dt_templateContext( rowData ){
                return strftime( '%Y-%m-%d %H:%M:%S', rowData.lastExpiration );
            }
        },
        {
            name: 'keylist',
            dt_visible: false
        },
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
Keygrips.tabular = function( dc ){
    new Tabular.Table({
        name: 'Keygrips',
        collection: null,
        data: Keygrips.dataSet( dc ),
        columns: Keygrips.fieldSet( dc ).toTabular(),
        serverSide: false,
        ajax: null,
        tabular: {
            withInfoButton: false,
            async deleteButtonTitle( it ){
                return pwixI18n.label( I18N, 'keygrips.list.keygrip_delete_title', it.label || it.id );
            },
            async deleteConfirmationText( it ){
                return pwixI18n.label( I18N, 'keygrips.list.keygrip_delete_confirm_text', it.label || it.id );
            },
            async deleteConfirmationTitle( it ){
                return pwixI18n.label( I18N, 'keygrips.list.keygrip_delete_confirm_title', it.label || it.id );
            },
            async editButtonTitle( it ){
                return pwixI18n.label( I18N, 'keygrips.list.keygrip_edit_title', it.label || it.id );
            },
            dataContext: dc
        },
        destroy: true,
        order: {
            name: 'lastCreated',
            dir: 'asc'
        },
    });
};
