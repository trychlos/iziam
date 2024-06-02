/*
 * /imports/client/components/app_saa/app_saa.js
 *
 * Manage startup-app-admin workflow if package is present
 */

import './app_saa.html';

Template.app_saa.helpers({
    // when we do not have yet an application administrator, let the user create the first one
    //  for now, at least pass the current args (which is implied nonetheless but that is explicit)
    saaArgs(){
        return {
            ...this,
            image: '/images/startup-app-admin-icon.svg'
        };
    },

    // if we do not have the package, then go directly to the content
    saaHasPackage(){
        return Object.keys( Package ).includes( 'pwix:startup-app-admin' );
    },

    // whether the package is present and ready
    saaReady(){
        return Package['pwix:startup-app-admin'].SAA.ready();
    },

    // whether to display the startup-app-admin panel
    saaShouldDisplay(){
        return Package['pwix:startup-app-admin'].SAA.countAdmins.get() === 0;
    }
});
