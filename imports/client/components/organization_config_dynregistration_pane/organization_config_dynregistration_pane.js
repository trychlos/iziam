/*
 * /imports/client/components/organization_config_dynregistration_pane/organization_config_dynregistration_pane.js
 *
 * Parms:
 * - see README
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { TenantsManager } from 'meteor/pwix:tenants-manager';

import './organization_config_dynregistration_pane.html';

Template.organization_config_dynregistration_pane.onCreated( function(){
    const self = this;

    self.APP = {
        fields: {
            dynamicRegistrationByConfidential: {
                js: '.js-confidential'
            },
            dynamicRegistrationByPublic: {
                js: '.js-public'
            },
            dynamicRegistrationByUser: {
                js: '.js-user'
            }
        },
        // the Checker instance
        checker: new ReactiveVar( null )
    };
});

Template.organization_config_dynregistration_pane.onRendered( function(){
    const self = this;
    const dataContext = Template.currentData();

    // initialize the Checker for this panel as soon as we get the parent Checker
    self.autorun(() => {
        const parentChecker = Template.currentData().checker?.get();
        const checker = self.APP.checker.get();
        if( parentChecker && !checker ){
            self.APP.checker.set( new Forms.Checker( self, {
                parent: parentChecker,
                panel: new Forms.Panel( self.APP.fields, TenantsManager.Records.fieldSet.get()),
                data: {
                    entity: Template.currentData().entity,
                    index: Template.currentData().index
                },
                setForm: Template.currentData().entity.get().DYN.records[Template.currentData().index].get(),
                fieldStatusShow: Forms.C.ShowStatus.NONE
            }));
        }
    });
});

Template.organization_config_dynregistration_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    }
});
