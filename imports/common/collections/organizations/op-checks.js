/*
 * /import/common/collections/organizations/op-checks.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { pwixI18n } from 'meteor/pwix:i18n';
import { TM } from 'meteor/pwix:typed-message';

import { Organizations } from './index.js';

/**
 * @locus Anywhere
 * @summary Whether the organization, defined by its entity and the to-be-checked record, is operational.
 * @param {Object} organization as an { entity, record } object
 * @returns {Array<TypedMessage>} or null
 */
Organizations.isOperational = async function( organization ){
    return null;
};
