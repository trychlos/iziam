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
        wantEditionSwitch: true
    },
    home: {
        route: '/',
        template: 'home_page',
        wantEditionSwitch: true
    },
    lm_cookies: {
        template: 'app_page',
        templateParms: {
            collection: 'legals',
            document: 'cookies-policy-231001'
        },
        route: '/pub/lm.cookies',
        wantEditionSwitch: true
    },
    lm_gdpr: {
        template: 'app_page',
        templateParms: {
            collection: 'legals',
            document: 'gdpr-231001'
        },
        route: '/pub/lm.gdpr',
        wantEditionSwitch: true
    },
    lm_gtu: {
        template: 'app_page',
        templateParms: {
            collection: 'legals',
            document: 'gtu-231001'
        },
        route: '/pub/lm.gtu',
        wantEditionSwitch: true
    },
    lm_legals: {
        template: 'app_page',
        templateParms: {
            collection: 'legals',
            document: 'legals-231001'
        },
        route: '/pub/lm.legals',
        wantEditionSwitch: true
    },
    managers: {
        template: 'managers_page',
        route: '/managers',
        inMenus: [ 'app_menu_button' ],
        menuLabel: 'header.menu.managers',
        wantEditionSwitch: true,
        wantPermission: 'menus.managers'
    },
    organization: {
        template: 'organization_page',
        route: '/org',
        inMenus: [ 'app_menu_button' ],
        menuLabel: 'header.menu.configuration',
        rolesEdit: [ 'ORG_SCOPED_MANAGER' ],
        wantScope: true,
        wantEditionSwitch: true
    },
    /*
    properties: {
        template: 'organization_edit',
        templateParms: Meteor.APP.OrganizationContext.editTemplateParms,
        inMenus: [ 'app_menu_button' ],
        menuLabel: 'header.menu.properties',
        wantScope: true,
        classes: 'item-modal'
    },
    */
    settings: {
        template: 'app_settings_edit',
        inMenus: [ 'app_menu_button' ],
        menuLabel: 'header.menu.settings',
        classes: 'item-modal',
        wantPermission: 'menus.app.settings'
    }
}, {
    unitfn: DisplayUnit
});
