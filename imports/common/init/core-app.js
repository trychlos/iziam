/*
 * /imports/common/init/core-app.js
 */

import { CoreApp } from 'meteor/pwix:core-app';

// configure the CoreAPP package for production
CoreApp.configure({
    appName: Meteor.APP.name,
    adminRole: Meteor.APP.C.appAdmin,
    //verbosity: CoreApp.C.Verbose.CONFIGURE
});
