/*
 * /imports/client/components/manager_organizations_tab/manager_organizations_tab.js
 *
 * Organizations management.
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

import './manager_organizations_tab.html';

Template.manager_organizations_tab.helpers({

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // TenantNewButton parameters
    parmsNewTenant(){
        return {
            shape: PlusButton.C.Shape.RECTANGLE
        }
    }
});