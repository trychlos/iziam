/*
 * /imports/common/init/tenants-manager.js
 */

import { TenantsManager } from 'meteor/pwix:tenants-manager';
import { Forms } from 'meteor/pwix:forms';

TenantsManager.configure({
    hideDisabled: false,
    roles: {
        list: 'TENANTS_LIST',
        create: 'TENANT_CREATE',
        edit: 'TENANT_EDIT',
        delete: 'TENANT_DELETE'
    }
    // verbosity: TenantsManager.C.Verbose.CONFIGURE
});
