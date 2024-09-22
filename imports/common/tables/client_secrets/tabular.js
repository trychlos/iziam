/*
 * /import/common/tables/client_secrets/tabular.js
 */

import strftime from 'strftime';

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
    secrets.forEach(( it ) => {
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
            name: 'startingAt',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'clients.secrets.list.starting_th' ),
            dt_render( data, type, rowData ){
                return rowData.startingAt ? strftime( '%Y-%m-%d', rowData.startingAt ) : null;
            }
        },
        {
            name: 'endingAt',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'clients.secrets.list.ending_th' ),
            dt_render( data, type, rowData ){
                return rowData.endingAt ? strftime( '%Y-%m-%d', rowData.endingAt ) : null;
            }
        },
        {
            name: 'createdAt',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'clients.secrets.list.created_at_th' ),
            dt_render( data, type, rowData ){
                return strftime( '%Y-%m-%d %H:%M:%S', rowData.createdAt );
            }
        },
        {
            name: 'createdBy',
            dt_type: 'string',
            dt_title: pwixI18n.label( I18N, 'clients.secrets.list.created_by_th' ),
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
