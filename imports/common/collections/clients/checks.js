/*
 * /imports/common/collections/clients/op-checks.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { pwixI18n } from 'meteor/pwix:i18n';
import { TM } from 'meteor/pwix:typed-message';

import { Clients } from './index.js';

/**
 * @locus Anywhere
 * @summary Whether the organization, defined by its entity and all its records, is operational at date.
 * @param {Object} entity
 * @param {Array<Object>} records
 * @returns {}
 */
Clients.isOperational = async function( entity, records ){

};
