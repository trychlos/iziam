/*
 * /imports/common/collections/clients_groups/server/event-emitter.js
 */

import EventEmitter from 'node:events';

import { ClientsGroups } from '../index.js';

ClientsGroups.s = ClientsGroups.s || {};
ClientsGroups.s.eventEmitter = new EventEmitter();
