/*
 * /imports/client/components/client_authorizations_panel/client_authorizations_panel.js
 *
 * A panel which let the client defines:
 * - either the chosen access token: the grant_type
 * - or some optional token extensions
 * 
 * This pane is written to be usable:
 * - either inside of the client-new-assistant
 * - or inside the client-edit.
 * 
 * Parms:
 * - entity: the currently edited client entity as a ReactiveVar
 * - index: the index of the edited record
 * - checker: the Forms.Checker which manages the parent component as a ReactiveVar
 * - organization: the Organization as an entity with its DYN.records array
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import './client_authorizations_panel.html';
