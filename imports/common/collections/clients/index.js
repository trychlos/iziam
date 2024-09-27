/*
 * /imports/common/collections/clients/index.js
 *
 * The clients registered with an organization.
 * This is a pseudo collection, which actually manages clients_entities / clients_records
 * 
 * All clients are stored in the two 'clients_e' and 'clients_r' collections as they all manage validity periods.
 * As a consequence, all organizations share these two  same clients collections.
 */

export { Clients } from './collection.js';

import './fieldset.js';
import './functions.js';
import './op-checks.js';
import './tabular.js'
