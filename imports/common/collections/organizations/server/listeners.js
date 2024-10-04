/*
 * /import/common/collections/organizations/server/listeners.js
 *
 * Connect on AccountsManager.s.eventEmitter and Clients.s.eventEmitter to update the witness timestamp.
 */

const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { AccountsManager } from 'meteor/pwix:accounts-manager';

import { Clients } from '/imports/common/collections/clients/index.js';

import { Organizations } from '../index.js';

AccountsManager.s.eventEmitter.on( 'create', Organizations.s.onCorrelatedUpdateEvent );
AccountsManager.s.eventEmitter.on( 'delete', Organizations.s.onCorrelatedUpdateEvent );
AccountsManager.s.eventEmitter.on( 'update', Organizations.s.onCorrelatedUpdateEvent );

Clients.s.eventEmitter.on( 'upsert', Organizations.s.onCorrelatedUpdateEvent );
