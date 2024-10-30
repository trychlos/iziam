/*
 * /imports/common/collections/authorizations/index.js
 *
 * The authorizations issued for this organization:
 *     <subject>                         <object>
 * - a client is allowed to access a resource (if m-to-m client profile)
 * - an identity group is allowed to access a client
 * - an identity group is allowed to access a resource
 * 
 * This is a design decision to force the use of identities groups, and refuse an authorization directly given to an identity.
 * 
 * As identities, groups and resources, there is one collection per organization.
 */

export { Authorizations } from './collection.js';

import './checks.js';
import './fieldset.js';
import './functions.js';
import './tabular.js';
