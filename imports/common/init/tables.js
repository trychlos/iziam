/*
 * /imports/common/init/tables.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { ClientSecrets } from '/imports/common/tables/client_secrets/index.js';
import { Jwks } from '/imports/common/tables/jwks/index.js';
import { KeygripSecrets } from '/imports/common/tables/keygrip_secrets/index.js';
import { Keygrips } from '/imports/common/tables/keygrips/index.js';
import { Providers } from '/imports/common/tables/providers/index.js';
