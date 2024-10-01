/*
 * /imports/server/init/tenants-manager.js
 */

import { TenantsManager } from 'meteor/pwix:tenants-manager';

import { Organizations } from '/imports/common/collections/organizations/index.js';

TenantsManager.configure({
    tabularServerExtend: Organizations.s.tabularExtend
});
