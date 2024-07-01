/*
 * /imports/common/init/index.js
 *
 * Imported both from the client and the server, this is our first executed code, and is common to the two sides.
 */

import { Meteor } from 'meteor/meteor';

if( false ){
    //require( '@vestergaard-company/js-mixin/package.json' );
}

import './app.js';
import './constants.js';
import './defaults.js';
import './i18n.js';
//
import './accounts-manager.js';
import './accounts-tools.js';
import './accounts-ui.js';
import './cookie-manager.js';
import './core-app.js';
import './date.js';
import './date-input.js';
import './env-settings.js';
import './field.js';
import './forms.js';
//import './ext-oauth-metadata.js';
//import './ext-openid.js';
//import './ext-openid-metadata.js';
//import './ext-publisher.js';
//import './helpers.js';
import './modal-info.js';
import './notes.js';
import './roles.js';
import './startup.js';
import './startup-app-admin.js';
import './tabbed.js';
import './tabular.js';
import './tenants-manager.js';
import './ui-layout.js';
import './validity.js';
// followings import a collection, so all must have been defined before them
//import './ext-oauth-functions.js';
//import './ext-openid-functions.js';
//import './providers.js';
//import './reserved-words.js';

//import '../../openmct/MCT.js';
