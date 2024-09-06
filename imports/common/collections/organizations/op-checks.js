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
 * @summary Whether the organization, defined by its entity and all its records, is operational at date.
 * @param {Object} entity
 * @param {Array<Object>} records
 * @returns {}
 */
Organizations.isOperational = async function( entity, records ){

};
