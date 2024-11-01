/*
 * /imports/common/collections/resources/server/event-emitter.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import EventEmitter from 'node:events';

import { Resources } from '../index.js';

Resources.s = Resources.s || {};
Resources.s.eventEmitter = new EventEmitter();
