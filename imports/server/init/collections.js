/*
 * /imports/server/init/collections.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import '/imports/common/collections/accounts/server/index.js';
import '/imports/common/collections/authorizations/server/index.js';
import '/imports/common/collections/clients_entities/server/index.js';
import '/imports/common/collections/clients_records/server/index.js';
import '/imports/common/collections/clients/server/index.js';
import '/imports/common/collections/clients_groups/server/index.js';
import '/imports/common/collections/identities/server/index.js';
import '/imports/common/collections/identities_groups/server/index.js';
import '/imports/common/collections/resources/server/index.js';
import '/imports/common/collections/statistics/server/index.js';
//
// have organizations at last as it depends of others
import '/imports/common/collections/organizations/server/index.js';
