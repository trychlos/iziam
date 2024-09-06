/*
 * /import/common/collections/organizations/server/functions.js
 */

import { TenantsManager } from 'meteor/pwix:tenants-manager';

import { Organizations } from '../index.js';

Organizations.s = {
    async getBy( selector, userId ){
        return await TenantsManager.Tenants.server.getBy( selector );
    }
};
