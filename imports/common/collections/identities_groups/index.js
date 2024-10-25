/*
 * /imports/common/collections/identities_groups/index.js
 *
 * The identities groups registered with an organization.
 * 
 * IdentitiesGroups are stored in collections per organization (as identities).
 * 
 * This is a tree where each group can have only one parent.
 */

export { IdentitiesGroups } from './collection.js';

import './checks.js';
import './fieldset.js';
import './functions.js';
