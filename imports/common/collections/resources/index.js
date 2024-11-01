/*
 * /imports/common/collections/resources/index.js
 *
 * The resources defined by this organization.
 * From our point of view, this is just a string that the organization says corresponding to some resource it is able to deliver.
 * This string must be unique inside of the organization, should be considered as immutable (though this is not forced here).
 * 
 * As identities and groups, there is one collection per organization.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

export { Resources } from './collection.js';

import './checks.js';
import './fieldset.js';
import './functions.js';
import './tabular.js';
