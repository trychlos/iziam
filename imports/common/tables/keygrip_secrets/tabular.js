/*
 * /import/common/tables/keygrip_secrets/tabular.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import strftime from 'strftime';

import { Field } from 'meteor/pwix:field';
import { pwixI18n } from 'meteor/pwix:i18n';
import { Tabular } from 'meteor/pwix:tabular';

import { HmacAlg } from '/imports/common/definitions/hmac-alg.def.js';
import { HmacEncoding } from '/imports/common/definitions/hmac-encoding.def.js';

import { KeygripSecrets } from './index.js';

/**
 * @locus Anywhere
 * @param {Object} dc the data context of the keygrips_list component
 * @returns {Array} the fieldset columns array
 *  A reactive data source
 */
KeygripSecrets.dataSet = function( dc ){
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
KeygripSecrets.fieldSet = function( dc ){
    let columns = [
        {
            name: '_id',
            dt_visible: false
        },
        {
            name: 'label',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'keygrips.list.label_th' )
        },
        {
            name: 'startingAt',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'keygrips.list.starting_th' ),
            dt_render( data, type, rowData ){
                return rowData.startingAt ? strftime( '%Y-%m-%d', rowData.startingAt ) : null;
            }
        },
        {
            name: 'endingAt',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'keygrips.list.ending_th' ),
            dt_render( data, type, rowData ){
                return rowData.endingAt ? strftime( '%Y-%m-%d', rowData.endingAt ) : null;
            }
        },
        {
            name: 'createdAt',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'keygrips.list.created_at_th' ),
            dt_className: 'ui-nowrap',
            dt_render( data, type, rowData ){
                return strftime( '%Y-%m-%d %H:%M:%S', rowData.createdAt );
            }
        },
        {
            name: 'createdBy',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'keygrips.list.created_by_th' ),
            dt_template: Meteor.isClient && Template.ahPreferredLabel,
            dt_templateContext( rowData ){
                return {
                    ahUserId: rowData.createdBy
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
KeygripSecrets.tabular = function( dc ){
    new Tabular.Table({
        name: 'KeygripSecrets',
        collection: null,
        data: KeygripSecrets.dataSet( dc ),
        columns: KeygripSecrets.fieldSet( dc ).toTabular(),
        serverSide: false,
        ajax: null,
        tabular: {
            withInfoButton: false,
            async deleteButtonTitle( it ){
                return pwixI18n.label( I18N, 'keygrips.list.secret_delete_title', it.label || it._id );
            },
            async deleteConfirmationText( it ){
                return pwixI18n.label( I18N, 'keygrips.list.secret_delete_confirm_text', it.label || it._id );
            },
            async deleteConfirmationTitle( it ){
                return pwixI18n.label( I18N, 'keygrips.list.secret_delete_confirm_title', it.label || it._id );
            },
            async editButtonTitle( it ){
                return pwixI18n.label( I18N, 'keygrips.list.secret_edit_title', it.label || it._id );
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
