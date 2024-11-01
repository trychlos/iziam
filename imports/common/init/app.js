/*
 * /imports/common/init/app.js
 *
 * Imported both from the client and the server, this is our first executed code, and is common to the two sides.
 * And this common code begins by creating the APP global object.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

Meteor.APP = {
    name: 'izIAM',
};
