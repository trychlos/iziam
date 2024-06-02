/*
 * /imports/common/init/startup-app-admin.js
 */

if( Package['pwix:startup-app-admin'] ){
    Package['pwix:startup-app-admin'].SAA.configure({
        adminRole: Meteor.APP.C.appAdmin,
        verbosity: 65535 //SAA_VERBOSE_NONE
    });
}
