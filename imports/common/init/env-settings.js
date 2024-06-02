/*
 * /imports/common/init/env-settings.js
 */

EnvSettings.configure({
    //verbosity: EnvSettings.C.Verbose.READY
    onReady(){
        const env = Meteor.settings.public.runtime.env;
        // copy to the client the environment context
        Meteor.settings.public[Meteor.APP.name].environment = Meteor.settings[Meteor.APP.name].environments[env];
    }
});
