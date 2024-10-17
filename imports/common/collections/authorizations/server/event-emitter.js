/*
 * /imports/common/collections/authorizations/server/event-emitter.js
 */

import EventEmitter from 'node:events';

import { Authorizations } from '../index.js';

Authorizations.s = Authorizations.s || {};
Authorizations.s.eventEmitter = new EventEmitter();
