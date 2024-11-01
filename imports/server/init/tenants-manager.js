/*
 * /imports/server/init/tenants-manager.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { TenantsManager } from 'meteor/pwix:tenants-manager';

import { Organizations } from '/imports/common/collections/organizations/index.js';

// server-side only configuration
TenantsManager.configure({
    serverAllExtend: Organizations.s.tenantsAllExtend,
    serverTabularExtend: Organizations.s.tabularExtend
});
