/*
 * /imports/common/init/startup-app-admin.js
 */

if( Package['pwix:startup-app-admin'] ){
    Package['pwix:startup-app-admin'].SAA.configure({
        adminRole: Meteor.APP.C.appAdmin,
        //verbosity: Package['pwix:startup-app-admin'].SAA.C.Verbose.CONFIGURE
    });
}
