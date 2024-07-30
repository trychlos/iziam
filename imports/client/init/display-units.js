/*
 * /imports/client/init/display-units.js
 * 
 *  Define here the DisplayUnit's of the application, and some of their relevant properties.
 */

import { DisplaySet } from '../classes/display-set.class.js';
import { DisplayUnit } from '../classes/display-unit.class.js';

Meteor.APP.displaySet = new DisplaySet({
    contact: {
        route: '/pub/contact',
        template: 'contact_page',
        wantEditionSwitch: true,
        wantEditionRoles: [ 'EDITOR' ]
    },
    home: {
        route: '/',
        template: 'home_page',
        wantEditionSwitch: true,
        wantEditionRoles: [ 'EDITOR' ]
    },
    lm_cookies: {
        template: 'app_page',
        templateParms: {
            collection: 'legals',
            document: 'cookies-policy-231001'
        },
        route: '/pub/lm.cookies',
        wantEditionSwitch: true,
        wantEditionRoles: [ 'EDITOR' ]
    },
    lm_gdpr: {
        template: 'app_page',
        templateParms: {
            collection: 'legals',
            document: 'gdpr-231001'
        },
        route: '/pub/lm.gdpr',
        wantEditionSwitch: true,
        wantEditionRoles: [ 'EDITOR' ]
    },
    lm_gtu: {
        template: 'app_page',
        templateParms: {
            collection: 'legals',
            document: 'gtu-231001'
        },
        route: '/pub/lm.gtu',
        wantEditionSwitch: true,
        wantEditionRoles: [ 'EDITOR' ]
    },
    lm_legals: {
        template: 'app_page',
        templateParms: {
            collection: 'legals',
            document: 'legals-231001'
        },
        route: '/pub/lm.legals',
        wantEditionSwitch: true,
        wantEditionRoles: [ 'EDITOR' ]
    },
    managers: {
        template: 'managers_page',
        route: '/managers',
        inMenus: [ 'app_menu_button' ],
        menuLabel: 'header.menu.managers',
        wantEditionSwitch: true,
        wantEditionRoles: [ 'EDITOR' ],
        wantPermission: 'pwix.app_pages.menus.managers'
    },
    organization: {
        template: 'organization_page',
        route: '/organization',
        inMenus: [ 'app_menu_button' ],
        menuLabel: 'header.menu.configuration',
        wantEditionSwitch: true,
        wantEditionRoles: [ 'EDITOR', 'SCOPED_EDITOR' ],
        wantPermission: 'pwix.app_pages.menus.organization',
        wantScope: true
    },
    /*
    properties: {
        template: 'organization_edit',
        templateParms: Meteor.APP.OrganizationContext.editTemplateParms,
        inMenus: [ 'app_menu_button' ],
        menuLabel: 'header.menu.properties',
        classes: 'item-modal',
        wantScope: true
    },
    */
    settings: {
        template: 'app_settings_edit',
        inMenus: [ 'app_menu_button' ],
        menuLabel: 'header.menu.settings',
        classes: 'item-modal',
        wantPermission: 'pwix.app_pages.menus.app.settings'
    }
}, {
    unitFn: DisplayUnit
});
