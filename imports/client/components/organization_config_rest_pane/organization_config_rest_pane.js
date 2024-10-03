/*
 * /imports/client/components/organization_config_rest_pane/organization_config_rest_pane.js
 *
 * Parms:
 * - checker: a ReactiveVar which contains the current Forms.Checker
 * - entity: a ReactiveVar which contains the Organization entity
 * - index: the index of the current record
 */

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { TenantsManager } from 'meteor/pwix:tenants-manager';

import { Organizations } from '/imports/common/collections/organizations/index.js';

import './organization_config_rest_pane.html';

Template.organization_config_rest_pane.onCreated( function(){
    const self = this;

    self.APP = {
        fields: {
            baseUrl: {
                js: '.js-baseurl'
            }
        },
        // the Checker instance
        checker: new ReactiveVar( null )
    };
});

Template.organization_config_rest_pane.onRendered( function(){
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
                setForm: Template.currentData().entity.get().DYN.records[Template.currentData().index].get()
            }));
        }
    });
});

Template.organization_config_rest_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    }
});