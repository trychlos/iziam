/*
 * /import/common/tables/keygrips/fieldset.js
 */

import { Field } from 'meteor/pwix:field';
import { Forms } from 'meteor/pwix:forms';
import SimpleSchema from 'meteor/aldeed:simple-schema';

import { Keygrips } from './index.js';

/**
 * @locus Anywhere
 * @returns {Array<Field.Def>} the fieldset columns array
 */
Keygrips.recordFieldDef = function(){
    let columns = [
        // -- Keygrips (used for cookies.keys)
        //    the database stores the secrets timestamped at their creation - Keygrip itself is only generated when used
        //    answers to "oidc-provider: cookies.keys option is critical to detect and ignore tampered cookies" message
        //    [Cookies](https://github.com/pillarjs/cookies)
        //      Cookies is a node.js module for getting and setting HTTP(S) cookies. Cookies can be signed to prevent tampering, using Keygrip.
        //    [Keygrip](https://www.npmjs.com/package/keygrip)
        //      Keygrip is a node.js module for signing and verifying data (such as cookies or URLs) through a rotating credential system,
        //      in which new server keys can be added and old ones removed regularly, without invalidating client credentials.
        //    NB: a Keygrip is an object { algorithm, encoding, keys_list }
        //        in order to be able to change alforithm and/or encoding, we manage here an array of keygrips
        {
            name: 'keygrips',
            type: Array,
            optional: true
        },
        {
            name: 'keygrips.$',
            type: Object
        },
        {
            name: 'keygrips.$._id',
            type: String
        },
        {
            name: 'keygrips.$.label',
            type: String,
            optional: true,
            form_check: Keygrips.checks.keygrip_label,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        // hmac alg
        {
            name: 'keygrips.$.alg',
            type: String,
            form_check: Keygrips.checks.keygrip_alg,
            form_type: Forms.FieldType.C.MANDATORY
        },
        // encoding
        {
            name: 'keygrips.$.encoding',
            type: String,
            form_check: Keygrips.checks.keygrip_encoding,
            form_type: Forms.FieldType.C.MANDATORY
        },
        // the size of the generated secret
        {
            name: 'keygrips.$.size',
            type: SimpleSchema.Integer,
            form_check: Keygrips.checks.keygrip_size,
            form_type: Forms.FieldType.C.MANDATORY
        },
        // and the list of secrets
        {
            name: 'keygrips.$.keylist',
            type: Array
        },
        {
            name: 'keygrips.$.keylist.$',
            type: Object
        },
        {
            name: 'keygrips.$.keylist.$._id',
            type: String
        },
        {
            name: 'keygrips.$.keylist.$.label',
            type: String,
            optional: true,
            form_check: Keygrips.checks.keygrip_secret_label,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        // an optional starting date date
        {
            name: 'keygrips.$.keylist.$.startingAt',
            type: Date,
            optional: true,
            form_check: Keygrips.checks.keygrip_secret_startingAt,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        // an optional ending date date
        {
            name: 'keygrips.$.keylist.$.endingAt',
            type: Date,
            optional: true,
            form_check: Keygrips.checks.keygrip_secret_endingAt,
            form_type: Forms.FieldType.C.OPTIONAL
        },
        // the secret key as a base64 string
        //  secret and hash are generated at same time
        {
            name: 'keygrips.$.keylist.$.secret',
            type: String,
            form_check: Keygrips.checks.keygrip_secret_secret,
            form_type: Forms.FieldType.C.NONE,
            form_status: false
        },
        // the SHA-256 hex hash of the secret key
        {
            name: 'keygrips.$.keylist.$.hash',
            type: String,
            form_check: Keygrips.checks.keygrip_secret_hash,
            form_type: Forms.FieldType.C.NONE,
            form_status: false
        },
        // creation timestamp
        {
            name: 'keygrips.$.keylist.$.createdAt',
            type: Date
        },
        {
            name: 'keygrips.$.keylist.$.createdBy',
            type: String
        }
    ];
    return columns;
};
