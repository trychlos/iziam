/*
 * /import/common/tables/client_secrets/index.js
 *
 * The client doesn't authenticate at the token endpoint
 * - either because it uses an Implicit flow
 * - or because it is a public client whithout secret or any other authentication mechanism.
 * In all other cases, a client must have at least one secret.
 *
 * The tabular display of the client secrets.
 */

export { ClientSecrets } from './object.js';

import './checks.js';
import './fieldset.js';
import './functions.js';
import './tabular.js';
