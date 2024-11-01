/*
 * /imports/common/init/startup-app-admin.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

if( Package['pwix:startup-app-admin'] ){
    Package['pwix:startup-app-admin'].SAA.configure({
        adminRole: Meteor.APP.C.appAdmin,
        //verbosity: Package['pwix:startup-app-admin'].SAA.C.Verbose.CONFIGURE
    });
}
