/*
 * /import/common/collections/providers/collection.js
 */

import { Tabular } from 'meteor/pwix:tabular';

import { Providers } from './index.js';

/**
 * @locus Anywhere
 * @summary Instanciates the Tabular.Table display to let an organization see and select the available providers
 *  This must be run in common code
 * @param {Object} caller either a client { entity, record } or an organization { entity, record }
 *  This is an object with following keys:
 *  - entity
 *  - record
 * @param {Function} selectedProviders a function which returns the currently selected providers
 * @param {Boolean} withConstraints whether the selection should respect each provider constraints (not at the organization level, only at the client level)
 * @returns {Tabular.Table} the list of providers which implement this type, which may be empty
 */
Providers.tabular = function( caller, selectedProviders, withConstraints ){
    return new Tabular.Table({
        name: 'Providers',
        collection: null,
        data: Providers.dataSet( caller, selectedProviders, withConstraints ),
        columns: Providers.fieldSet( caller, selectedProviders, withConstraints ).toTabular(),
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
