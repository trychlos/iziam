/*
 * /import/common/tables/client_secrets/tabular.js
 */

import strftime from 'strftime';

import { DateJs } from 'meteor/pwix:date';
import { Field } from 'meteor/pwix:field';
import { pwixI18n } from 'meteor/pwix:i18n';
import { Tabular } from 'meteor/pwix:tabular';

import { ClientSecrets } from './index.js';

/**
 * @locus Anywhere
 * @param {Object} dc the data context of the client_secrets_list component
 * @returns {Array} the fieldset columns array
 *  A reactive data source
 */
ClientSecrets.dataSet = function( dc ){
    let dataset = [];
    const secrets = dc.listGetFn( dc.args );
    let maxCreated = null;
    let maxExpire = null;
    secrets.forEach(( it ) => {
        let o = it;
        if( DateJs.compare( maxCreated, it.createdAt ) < 0 ){
            maxCreated = it.createdAt;
        }
        if( it.expireAt && DateJs.compare( maxExpire, it.expireAt ) < 0 ){
            maxExpire = it.expireAt;
        }
        it.lastCreated = maxCreated;
        it.lastExpiration = maxExpire;
        it.count = it.keylist.length;
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
ClientSecrets.tabularFieldSet = function( dc ){
    let columns = [
        {
            name: 'id',
            dt_visible: false
        },
        {
            name: 'label',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'clients.secrets.list.label_th' )
        },
        {
            name: 'alg',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'clients.secrets.list.alg_th' )
        },
        {
            name: 'encoding',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'clients.secrets.list.encoding_th' )
        },
        {
            name: 'lastCreated',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'clients.secrets.list.last_created_th' ),
            dt_render( data, type, rowData ){
                return strftime( '%Y-%m-%d %H:%M:%S', rowData.lastCreated );
            }
        },
        {
            name: 'lastExpiration',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'clients.secrets.list.last_expiration_th' ),
            dt_render( data, type, rowData ){
                return rowData.lastExpiration ? strftime( '%Y-%m-%d', rowData.lastExpiration ) : null;
            }
        },
        {
            name: 'count',
            dt_type: 'num',
            dt_title: pwixI18n.label( I18N, 'clients.secrets.list.count_th' )
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
ClientSecrets.tabular = function( dc ){
    new Tabular.Table({
        name: 'ClientSecrets',
        collection: null,
        data: ClientSecrets.dataSet( dc ),
        columns: ClientSecrets.tabularFieldSet( dc ).toTabular(),
        serverSide: false,
        ajax: null,
        tabular: {
            withInfoButton: false,
            async deleteButtonTitle( it ){
                return pwixI18n.label( I18N, 'clients.secrets.list.delete_title', it.label || it.id );
            },
            async deleteConfirmationText( it ){
                return pwixI18n.label( I18N, 'clients.secrets.list.delete_confirm_text', it.label || it.id );
            },
            async deleteConfirmationTitle( it ){
                return pwixI18n.label( I18N, 'clients.secrets.list.delete_confirm_title', it.label || it.id );
            },
            async editButtonTitle( it ){
                return pwixI18n.label( I18N, 'clients.secrets.list.edit_title', it.label || it.id );
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
