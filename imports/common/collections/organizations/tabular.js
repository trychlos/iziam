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
                },
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
