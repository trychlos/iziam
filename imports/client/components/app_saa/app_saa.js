/*
 * /imports/client/components/app_saa/app_saa.js
 *
 * Manage startup-app-admin workflow if package is present
 */

import './app_saa.html';

Template.app_saa.onCreated( function(){
    const self = this;

    // track the ready status of the SAA package
    self.autorun(() => {
        console.debug( 'pwix:startup-app-admin.SAA.ready', Package['pwix:startup-app-admin'].SAA.ready());
    });
});

Template.app_saa.helpers({
    // when we do not have yet an application administrator, let the user create the first one
    //  for now, at least pass the current args (which is implied nonetheless but that is explicit)
    saaArgs(){
        return {
            ...this,
            image: '/images/startup-app-admin-icon.svg'
        };
    }
});
