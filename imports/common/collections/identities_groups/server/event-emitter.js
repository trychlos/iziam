/*
 * /imports/common/collections/identities_groups/server/event-emitter.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import EventEmitter from 'node:events';

import { IdentitiesGroups } from '../index.js';

IdentitiesGroups.s = IdentitiesGroups.s || {};
IdentitiesGroups.s.eventEmitter = new EventEmitter();
