/*
 * /import/common/collections/providers/collection.js
 */

import { Tabular } from 'meteor/pwix:tabular';

import { Providers } from './index.js';

/**
 * @locus Anywhere
 * @summary Instanciates the Tabular.Table display to let an organization see and select the available providers
 *  This must be run in common code
 * @param {Object} tenant the current tenant, is null on server side
 *  This is an object with following keys:
 *  - entity
 *  - record
 * @returns {Tabular.Table} the list of providers which implement this type, which may be empty
 */
Providers.tabular = function( tenant ){
    return new Tabular.Table({
        name: 'Providers',
        collection: null,
        data: Providers.dataSet( tenant ),
        columns: Providers.fieldSet( tenant ).toTabular(),
        serverSide: false,
        ajax: null,
        tabular: {
            withEditButton: false,
            withDeleteButton: false,
            withInfoButton: false
        },
        destroy: true,
        order: {
            name: 'ident',
            dir: 'asc'
        },
    });
};
