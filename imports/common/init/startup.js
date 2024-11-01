/*
 * /imports/common/init/startup.js
 *
 * Code executed both on client and server at Meteor startup() time.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

Meteor.startup(() => {
    console.debug( '/imports/common/init/startup.js' );
});
