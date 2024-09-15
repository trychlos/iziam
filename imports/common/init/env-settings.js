/*
 * /imports/common/init/env-settings.js
 */

import { EnvSettings } from 'meteor/pwix:env-settings';

EnvSettings.configure({
    //reconfigurePackages: true,
    sourcePath: Meteor.APP.name + '.environments',
    //sourcePath: 'environments',
    targetPath: Meteor.APP.name + '.environment',
    //targetPath: 'environment',
    verbosity: EnvSettings.C.Verbose.CONFIGURE | EnvSettings.C.Verbose.READY | EnvSettings.C.Verbose.RECONFIGURE
    //verbosity: EnvSettings.C.Verbose.CONFIGURE
});
