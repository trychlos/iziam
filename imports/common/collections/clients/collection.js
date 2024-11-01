/*
 * /imports/common/collections/clients/collection.js
 *
 * The clients registered with an organization.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { ReactiveVar } from 'meteor/reactive-var';

export const Clients = {
    fieldSet: new ReactiveVar( null )
};
