/*
 * /imports/client/components/home_page/home_page.js
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import './home_page.html';

Template.home_page.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    }
});
