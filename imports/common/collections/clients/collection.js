/*
 * /imports/collections/clients/collection.js
 *
 * The clients registered with an organization.
 */

import { ReactiveVar } from 'meteor/reactive-var';

export const Clients = {
    checks: {},
    fieldSet: new ReactiveVar( null )
};
