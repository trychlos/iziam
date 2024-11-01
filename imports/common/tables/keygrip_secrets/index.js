/*
 * /import/common/tables/keygrip_secrets/index.js
 *
 * The tabular display of the JSON Web Keys Set.
 * 
 * The main component is keygrip_secrets_list which calls the tabular() function to initialize.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

export { KeygripSecrets } from './object.js';

import './functions.js';
import './tabular.js';
