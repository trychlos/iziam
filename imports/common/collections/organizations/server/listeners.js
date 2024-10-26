/*
 * /import/common/collections/organizations/server/listeners.js
 *
 * Connect on AccountsManager.s.eventEmitter and Clients.s.eventEmitter to update the witness timestamp.
 */

const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { AccountsManager } from 'meteor/pwix:accounts-manager';

import { Authorizations } from '/imports/common/collections/authorizations/index.js';
import { Clients } from '/imports/common/collections/clients/index.js';
import { ClientsGroups } from '/imports/common/collections/clients_groups/index.js';
import { IdentitiesGroups } from '/imports/common/collections/identities_groups/index.js';
import { Resources } from '/imports/common/collections/resources/index.js';

import { Organizations } from '../index.js';

Authorizations.s.eventEmitter.on( 'create', Organizations.s.onCorrelatedUpdateEvent );
Authorizations.s.eventEmitter.on( 'delete', Organizations.s.onCorrelatedUpdateEvent );
Authorizations.s.eventEmitter.on( 'update', Organizations.s.onCorrelatedUpdateEvent );
Authorizations.s.eventEmitter.on( 'upsert', Organizations.s.onCorrelatedUpdateEvent );

AccountsManager.s.eventEmitter.on( 'create', Organizations.s.onCorrelatedUpdateEvent );
AccountsManager.s.eventEmitter.on( 'delete', Organizations.s.onCorrelatedUpdateEvent );
AccountsManager.s.eventEmitter.on( 'update', Organizations.s.onCorrelatedUpdateEvent );

Clients.s.eventEmitter.on( 'upsert', Organizations.s.onCorrelatedUpdateEvent );

ClientsGroups.s.eventEmitter.on( 'upsert', Organizations.s.onCorrelatedUpdateEvent );
IdentitiesGroups.s.eventEmitter.on( 'upsert', Organizations.s.onCorrelatedUpdateEvent );

Resources.s.eventEmitter.on( 'delete', Organizations.s.onCorrelatedUpdateEvent );
Resources.s.eventEmitter.on( 'upsert', Organizations.s.onCorrelatedUpdateEvent );
