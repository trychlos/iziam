/*
 * /import/common/collections/organizations/fieldset.js
 *
 * The fields to be added to the Tenant's entity and to the Tenant's record.
 */

import { Forms } from 'meteor/pwix:forms';

import { Organizations } from './index.js';

Organizations.entityFieldset = function(){
    return null;
};

Organizations.recordFieldset = function(){
    return [
        {
            //before: 'notes',
            fields: [
                // the REST base URL to be used as the base path for all REST requests
                // mandatory to enable the REST API, must be unique between all organizations
                {
                    name: 'baseUrl',
                    type: String,
                    optional: true,
                    form_check: Organizations.checks.baseUrl,
                    form_type: Forms.FieldType.C.OPTIONAL
                }
            ]
        }
    ];
};
