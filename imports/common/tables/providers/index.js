/*
 * /import/common/tables/providers/index.js
 *
 * A table of the registered providers.
 * 
 * This is used:
 * - at the organization level: let the manager selection which providers may be in use in his organization
 * - at each client level: let the creator defines which providers (among those allowed by the organziation) will be actually used by this client.
 * 
 * The main component is providers_list which calls the tabular() function to initialize.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

export { Providers } from './object.js';

import './functions.js';
import './tabular.js';
