/*
 * /imports/common/collections/authorizations/index.js
 *
 * The authorizations issued for this organization: maps groups to resources and clients.
 * 
 * As identities, groups and resources, there is one collection per organization.
 */

export { Authorizations } from './collection.js';

import './checks.js';
import './fieldset.js';
import './functions.js';
import './tabular.js';
