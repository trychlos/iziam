/*
 * /imports/client/components/organization_properties_panel/organization_properties_panel.js
 *
 * Embeds the TenantEditRecordPropertiesPanel panel component
 *
 * Parms:
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { TenantsManager } from 'meteor/pwix:tenants-manager';

import { Organizations } from '/imports/common/collections/organizations/index.js';

import './organization_properties_panel.html';

Template.organization_properties_panel.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // parms for the TenantEditRecordPropertiesPanel component
    parmsTenantEdit(){
        return this;
    }
});

Template.organization_properties_panel.events({
    // ask for clear the panel
    'iz-clear-panel .c-organization-properties-panel'( event, instance ){
        instance.APP.checker.get().clearPanel();
    },
    // ask for enabling the checker (when this panel is used inside of an assistant)
    'iz-enable-checks .c-organization-properties-panel'( event, instance, enabled ){
        console.debug( 'forwarding to TenantRecordPropertiesPanel' );
        instance.$( '.TenantRecordPropertiesPanel' ).trigger( event.type, enabled );
        return false;
    }
});
