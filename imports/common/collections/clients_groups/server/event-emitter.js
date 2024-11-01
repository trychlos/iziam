/*
 * /imports/common/collections/clients_groups/server/event-emitter.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import EventEmitter from 'node:events';

import { ClientsGroups } from '../index.js';

ClientsGroups.s = ClientsGroups.s || {};
ClientsGroups.s.eventEmitter = new EventEmitter();
