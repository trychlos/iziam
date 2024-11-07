/*
 * /imports/client/components/organization_rest_pane/organization_rest_pane.js
 *
 * Parms:
 * - checker: a ReactiveVar which contains the current Forms.Checker
 * - entity: a ReactiveVar which contains the Organization entity
 * - index: the index of the current record
 * - enableChecks: when inside of an assistant, defaulting to true
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import '/imports/client/components/organization_rest_panel/organization_rest_panel.js';

import './organization_rest_pane.html';
