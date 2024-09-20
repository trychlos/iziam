/*
 * /imports/client/components/client_config_panel/client_config_panel.js
 *
 * Parms:
 * - organization: an { entity, record } object
 * - entity: a ReactiveVar which contains the Organization, with its DYN.records array of ReactiveVar's
 * - index: the index of the current edited organization record
 * - checker: a ReactiveVar which contains the parent checker
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import '/imports/client/components/jwk_edit_dialog/jwk_edit_dialog.js';
import '/imports/client/components/jwk_new_button/jwk_new_button.js';
import '/imports/client/components/jwks_list/jwks_list.js';

import './client_config_panel.html';

Template.client_config_panel.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    }
});
