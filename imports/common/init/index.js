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
import './i18n.js';
import './permissions.js';
//
import './accounts-base.js';
import './accounts-hub.js';
import './accounts-manager.js';
import './accounts-manager-accounts.js';
import './accounts-manager-permissions.js';
import './accounts-ui.js';
import './app-edit.js';
import './app-pages.js';
import './assistant.js';
import './collection2.js';
import './collections-get.js';
import './cookie-manager.js';
import './core-app.js';
import './date.js';
import './date-input.js';
import './display-units.js';
import './env-settings.js';
import './field.js';
import './forms.js';
import './modal.js';
import './modal-info.js';
import './notes.js';
import './providers.js';
import './reserved-words.js';
import './roles.js';
import './startup.js';
import './startup-app-admin.js';
import './tabbed.js';
import './tables.js';
import './tabular.js';
import './tenants-manager.js';
import './tolert.js';
import './ui-layout.js';
import './validity.js';
