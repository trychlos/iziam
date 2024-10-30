/*
 * /imports/common/collections/authorizations/functions.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { Authorizations } from './index.js';

Authorizations.fn = {

    /**
     * @locus Anywhere
     * @param {<Authorization>} authorization
     * @returns {String} a suitable multi-usage label for this authorization
     */
    label( authorization ){
        return [ authorization.subject_type, authorization.DYN.subject_label, authorization.object_type, authorization.DYN.object_label ].join( '-' );
    }
};
