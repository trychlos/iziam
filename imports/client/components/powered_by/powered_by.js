/*
 * /imports/ui/components/powered_by/powered_by.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import './powered_by.html';

Template.powered_by.helpers({
    // string localization
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    }
});
