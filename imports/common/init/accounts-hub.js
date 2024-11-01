/*
 * /imports/common/init/accounts-hub.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { AccountsHub } from 'meteor/pwix:accounts-hub';
import { EnvSettings } from 'meteor/pwix:env-settings';
import { Tracker } from 'meteor/tracker';

// configure the AccountsHub package for production
AccountsHub.configure({
    //verbosity: AccountsHub.C.Verbose.CONFIGURE
});

// configure the AccountsHub 'users' instance for development
//  we choose to instanciate it without waiting for startup
Tracker.autorun(() => {
    const settings = EnvSettings.environmentSettings();
    if( settings && settings.type === 'development' ){
        const instance = AccountsHub.instances.users || new AccountsHub.ahClass();
        if( instance ){
            console.log( 'configure the AccountsHub \'users\' instance for development' )
            instance.opts().base_set({
                passwordLength: 4,
                passwordStrength: AccountsHub.C.Password.VERYWEAK
            });
        }
    }
});
