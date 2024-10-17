/*
 * /imports/common/collections/groups/server/event-emitter.js
 */

import EventEmitter from 'node:events';

import { Groups } from '../index.js';

Groups.s = Groups.s || {};
Groups.s.eventEmitter = new EventEmitter();
