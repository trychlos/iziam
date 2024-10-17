/*
 * /imports/common/collections/resources/server/event-emitter.js
 */

import EventEmitter from 'node:events';

import { Resources } from '../index.js';

Resources.s = Resources.s || {};
Resources.s.eventEmitter = new EventEmitter();
