/*
 * /imports/server/init/startup.js
 *
 * Code executed on server at startup
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

// examine some variables
Meteor.startup(() => {
    console.debug( '/imports/server/init/startup.js' );
    //console.log( 'Meteor.startup(): Meteor.settings', Meteor.settings );
    console.log( 'Meteor.startup(): NODE_ENV=\''+process.env['NODE_ENV']+'\'' );
    console.log( 'Meteor.startup(): APP_ENV=\''+process.env['APP_ENV']+'\'' );
});
