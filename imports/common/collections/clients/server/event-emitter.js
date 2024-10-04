/*
 * /imports/common/collections/clients/server/event-emitter.js
 */

import EventEmitter from 'node:events';

import { Clients } from '../index.js';

Clients.s = Clients.s || {};
Clients.s.eventEmitter = new EventEmitter();
