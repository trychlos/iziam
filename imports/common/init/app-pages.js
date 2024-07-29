/*
 * /imports/common/init/app-pages.js
 */

import { AppPages } from 'meteor/pwix:app-pages';

AppPages.configure({
    classes: [ Meteor.APP.defaults.layoutTheme, Meteor.APP.defaults.colorTheme ],
    //classes: [ 't-page' ],
    //menuIcon: 'fa-chevron-right',
    //verbosity: 65535
    //verbosity: AppPages.C.Verbose.CONFIGURE
});
