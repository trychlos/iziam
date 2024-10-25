/*
 * /imports/common/collections/identities_groups/server/event-emitter.js
 */

import EventEmitter from 'node:events';

import { IdentitiesGroups } from '../index.js';

IdentitiesGroups.s = IdentitiesGroups.s || {};
IdentitiesGroups.s.eventEmitter = new EventEmitter();
