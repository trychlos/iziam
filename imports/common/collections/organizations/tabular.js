/*
 * /import/common/collections/organizations/tabular.js
 *
 * Extends the TenantsManager tabular fieldset.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

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
                    name: 'identitiesGroupsCount',
                    schema: false,
                    dt_visible: false
                },
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
                    name: 'clientsGroupsCount',
                    schema: false,
                    dt_visible: false
                },
                {
                    name: 'clientsCount',
                    schema: false,
                    dt_className: 'ui-center',
                    dt_title: pwixI18n.label( I18N, 'organizations.tabular.clients_th' ),
                    dt_render( foo, type, rowData, columnDef ){
                        return rowData.clientsCount ? '<div class="dt-badge">'+rowData.clientsCount+'</div>' : '';
                    }
                },
                {
                    name: 'resourcesCount',
                    schema: false,
                    dt_className: 'ui-center',
                    dt_title: pwixI18n.label( I18N, 'organizations.tabular.resources_th' ),
                    dt_render( foo, type, rowData, columnDef ){
                        return rowData.resourcesCount ? '<div class="dt-badge">'+rowData.resourcesCount+'</div>' : '';
                    }
                },
                {
                    name: 'authorizationsCount',
                    schema: false,
                    dt_className: 'ui-center',
                    dt_title: pwixI18n.label( I18N, 'organizations.tabular.authorizations_th' ),
                    dt_render( foo, type, rowData, columnDef ){
                        return rowData.authorizationsCount ? '<div class="dt-badge">'+rowData.authorizationsCount+'</div>' : '';
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
