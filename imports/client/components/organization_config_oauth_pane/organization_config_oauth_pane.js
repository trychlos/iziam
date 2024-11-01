/*
 * /imports/client/components/organization_config_oauth_pane/organization_config_oauth_pane.js
 *
 * Parms:
 * - checker: a ReactiveVar which contains the current Forms.Checker
 * - entity: a ReactiveVar which contains the Organization entity
 * - index: the index of the current record
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { TenantsManager } from 'meteor/pwix:tenants-manager';

import { Organizations } from '/imports/common/collections/organizations/index.js';

import './organization_config_oauth_pane.html';

Template.organization_config_oauth_pane.onCreated( function(){
    const self = this;

    self.APP = {
        fields: {
            issuer: {
                js: '.js-issuer'
            },
            wantsPkce: {
                js: '.js-pkce',
                form_status: Forms.C.ShowStatus.TRANSPARENT
            }
        },
        // the current { entity, record } organization object
        organization: new ReactiveVar( null ),
        // the full base url
        baseUrl: new ReactiveVar( null ),
        // the Checker instance
        checker: new ReactiveVar( null )
    };

    // maintain the current { entity, record } organization object
    self.autorun(() => {
        const entity = Template.currentData().entity.get();
        const record = entity.DYN.records[Template.currentData().index].get();
        self.APP.organization.set({ entity: entity, record: record });
    });

    // maintain the full issuer+baseUrl
    self.autorun(() => {
        self.APP.baseUrl.set( Organizations.fn.fullBaseUrl( self.APP.organization.get()));
    });

    // setup some default values in the organization record (must be same than those defined in fieldset)
    self.autorun(() => {
        const dataContext = Template.currentData();
        const entity = dataContext.entity.get();
        let record = entity.DYN.records[dataContext.index].get();
        if( !Object.keys( record ).includes( 'wantsPkce' )){
            record.wantsPkce = true;
        }
    });
});

Template.organization_config_oauth_pane.onRendered( function(){
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

Template.organization_config_oauth_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },
    // an example of the issuer value
    // using the well-known server discovery url
    issuer_example(){
        return pwixI18n.label( I18N, 'organizations.edit.issuer_example', Template.instance().APP.baseUrl.get() + Meteor.APP.C.oauthMetadataPath );
    }
});
