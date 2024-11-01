/*
 * /imports/client/components/app_footer/app_footer.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import '/imports/client/components/powered_by/powered_by.js';
import '/imports/client/components/site_copyright/site_copyright.js';

import './app_footer.html';

Template.app_footer.helpers({
    parmsCookies(){
        return {
            route: '/lm.cookies'
        };
    },
    parmsGDPR(){
        return {
            route: '/lm.gdpr'
        };
    },
    parmsGTU(){
        return {
            route: '/lm.gtu'
        };
    },
    parmsLegals(){
        return {
            route: '/lm.legals'
        };
    },
    // whether we want display the page footer
    wantFooter(){
        return Meteor.APP.runContext.wantFooter();
    }
});
