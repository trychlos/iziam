/*
 * /import/common/tables/client_secrets/fieldset.js
 */

import { Field } from 'meteor/pwix:field';
import { Forms } from 'meteor/pwix:forms';
import SimpleSchema from 'meteor/aldeed:simple-schema';

import { ClientSecrets } from './index.js';

/**
 * @locus Anywhere
 * @returns {Array<Field.Def>} the fieldset columns array
 */
ClientSecrets.recordFieldDef = function(){
    let columns = [
        //  NOTE: oidc-provider needs the clear secret to handle the client authentification - so keep it here
        {
            name: 'secrets',
            type: Array,
            optional: true
        },
        {
            name: 'secrets.$',
            type: Object
        },
        {
            name: 'secrets.$._id',     // the UI needs a '_id' identifier for each item
            type: String
        },
        {
            name: 'secrets.$.label',
            type: String,
            optional: true,
            form_check: ClientSecrets.checks.secret_label,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        {
            name: 'secrets.$.size',
            type: SimpleSchema.Integer,
            form_check: ClientSecrets.checks.secret_size,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        {
            name: 'secrets.$.encoding',
            type: String,
            form_check: ClientSecrets.checks.secret_encoding,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        {
            name: 'secrets.$.hex',
            type: String,
            form_check: ClientSecrets.checks.secret_hex,
        },
        {
            name: 'secrets.$.startingAt',
            type: Date,
            optional: true,
            form_check: ClientSecrets.checks.secret_startingAt,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        {
            name: 'secrets.$.endingAt',
            type: Date,
            optional: true,
            form_check: ClientSecrets.checks.secret_endingAt,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        {
            name: 'secrets.$.createdAt',
            type: Date
        },
        {
            name: 'secrets.$.createdBy',
            type: String
        },
    ];
    return columns;
};
