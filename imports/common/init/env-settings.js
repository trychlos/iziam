/*
 * /imports/common/init/env-settings.js
 */

import { CoreApp } from 'meteor/pwix:core-app';

EnvSettings.configure({
    //verbosity: EnvSettings.C.Verbose.READY
    onReady(){
        CoreApp.onEnvSettingsReady();
    }
});
