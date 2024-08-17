/*
 * /import/common/collections/providers/collection.js
 */

import { Tabular } from 'meteor/pwix:tabular';

import { Providers } from './index.js';

/**
 * @locus Anywhere
 * @summary Instanciates the Tabular.Table display to let an organization see and select the available providers
 *  This must be run in common code
 * @param {Object} dc the data context of the providers_list component
 * @returns {Tabular.Table} the list of providers which implement this type, which may be empty
 */
Providers.tabular = function( dc ){
    return new Tabular.Table({
        name: 'Providers',
        collection: null,
        data: Providers.dataSet( dc ),
        columns: Providers.fieldSet( dc ).toTabular(),
        serverSide: false,
        ajax: null,
        tabular: {
            withEditButton: false,
            withDeleteButton: false,
            withInfoButton: false
        },
        destroy: true,
        order: {
            name: 'id',
            dir: 'asc'
        },
    });
};
