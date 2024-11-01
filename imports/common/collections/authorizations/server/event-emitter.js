/*
 * /imports/common/collections/authorizations/server/event-emitter.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import EventEmitter from 'node:events';

import { Authorizations } from '../index.js';

Authorizations.s = Authorizations.s || {};
Authorizations.s.eventEmitter = new EventEmitter();
