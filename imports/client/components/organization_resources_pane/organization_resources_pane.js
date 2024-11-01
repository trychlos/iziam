/*
 * /imports/client/components/organization_resources_pane/organization_resources_pane.js
 *
 * Display the resources.
 * 
 * +- <this>
 *     |
 *     +- resource_new_button
 *     |   |
 *     |   +-> trigger resource_edit_dialog
 *     |
 *     +- resources_list
 *         |
 *         +-> trigger resource_edit_dialog
 *
 * Parms:
 * - item: a ReactiveVar which contains the Organization as an entity with its DYN.records array
 * - checker: a ReactiveVar which contains the parent Forms.Checker
 * - entityTabs
 * - recordTabs
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';

import '/imports/client/components/resource_new_button/resource_new_button.js';
import '/imports/client/components/resources_list/resources_list.js';

import './organization_resources_pane.html';

Template.organization_resources_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    }
});
