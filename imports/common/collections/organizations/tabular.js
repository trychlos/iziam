/*
 * /import/common/collections/organizations/tabular.js
 *
 * Extends the TenantsManager tabular fieldset.
 */

import { Organizations } from './index.js';

Organizations.tabularFieldset = function(){
    return [
        {
            before: 'pdmpUrl',
            fields: [
                {
                    name: 'baseUrl',
                    schema: false,
                    dt_title: pwixI18n.label( I18N, 'organizations.tabular.baseurl_th' )
                }
            ]
        },
        {
            before: 'effectStart',
            fields: [
                {
                    name: 'identitiesCount',
                    schema: false,
                    dt_className: 'ui-center',
                    dt_title: pwixI18n.label( I18N, 'organizations.tabular.identities_th' ),
                    dt_render( foo, type, rowData, columnDef ){
                        return rowData.identitiesCount ? '<div class="dt-badge">'+rowData.identitiesCount+'</div>' : '';
                    }
                },
                {
                    name: 'clientsCount',
                    schema: false,
                    dt_className: 'ui-center',
                    dt_title: pwixI18n.label( I18N, 'organizations.tabular.clients_th' ),
                    dt_render( foo, type, rowData, columnDef ){
                        return rowData.clientsCount ? '<div class="dt-badge">'+rowData.clientsCount+'</div>' : '';
                    }
                }
            ]
        }
    ];
};

Organizations.tabularButtons = function(){
    return [
        {
            where: Tabular.C.Where.AFTER,
            buttons: [
                'organization_operational_badge'
            ]
        }
    ];
};
