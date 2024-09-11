/*
 * /imports/client/components/jwk_public_pane/jwk_public_pane.js
 *
 * Display the symmetric secret object
 *
 * Parms:
 * - organization: an { entity, record } organization object
 * - checker: a ReactiveVar which holds the parent Checker
 * - item: a ReactiveVar which contains the JWK item to be edited here
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';

import './jwk_public_pane.html';