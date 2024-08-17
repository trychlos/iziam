/*
 * /import/common/collections/providers/index.js
 *
 * A pseudo-collection for the registered providers.
 * 
 * This pseudo-collection is used:
 * - at the organization level: let the manager selection which providers may be in use in his organization
 * - at each client level: let the creator defines which providers (among those allowed by the organziation) will be actually used by this client.
 * 
 * The main component is providers_list which calls the tabular() function to initialize.
 */

export { Providers } from './collection.js';

import './checks.js';
import './fieldset.js';
import './functions.js';
import './tabular.js';
