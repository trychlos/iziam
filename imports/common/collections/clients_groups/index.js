/*
 * /imports/common/collections/clients_groups/index.js
 *
 * The clients groups registered with an organization.
 * 
 * Groups are stored in collections per organization (as identities).
 * 
 * This is a tree where each group can have only one parent.
 */

export { ClientsGroups } from './collection.js';

import './checks.js';
import './fieldset.js';
import './functions.js';
