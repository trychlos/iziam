/*
 * /imports/common/collections/identities/init.js
 *
 * The identities registered with an organization.
 * 
 * Identities are managed by the pwix:accounts-manager package.
 * 
 * Each organization has its own accounts entity, named as 'identities_<organization_id>'. Rationale is multiple:
 * - a confidentiality reason: there is no mix possible in accounts from two tenants
 * - management: tenants may have same accounts; in other words, someone with an email address may be registered within two tenants
 * - export per organization is more easy
 * 
 * See:
 *  - https://openid.net/specs/openid-connect-core-1_0.html#ScopeClaims
 *  - https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/oauth2/core/oidc/StandardClaimNames.html
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

export { Identities } from './collection.js';

import './checks.js';
import './claims.js';
import './fieldset.js';
import './functions.js';
import './tabular.js';
