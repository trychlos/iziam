/*
 * pwix:tenants-manager/src/client/components/organization_urls_pane/organization_urls_pane.js
 *
 * Parms:
 * - see README
 */

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { TenantsManager } from 'meteor/pwix:tenants-manager';

import { Organizations } from '/imports/common/collections/organizations/index.js';

import './organization_urls_pane.html';

Template.organization_urls_pane.onCreated( function(){
    const self = this;

    self.APP = {
        fields: {
            issuer: {
                js: '.js-issuer'
            },
            baseUrl: {
                js: '.js-baseurl'
            },
            authorization_endpoint: {
                js: '.js-authorization'
            },
            token_endpoint: {
                js: '.js-token'
            },
            registration_endpoint: {
                js: '.js-dynamic'
            },
            jwks_uri: {
                js: '.js-jwks'
            }
        },
        // the Checker instance
        checker: new ReactiveVar( null ),
        // the current { entity, record } organization object
        organization: new ReactiveVar( null ),
        // the full base url
        baseUrl: new ReactiveVar( null )
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
});

Template.organization_urls_pane.onRendered( function(){
    const self = this;
    const dataContext = Template.currentData();

    // initialize the Checker for this panel as soon as we get the parent Checker
    self.autorun(() => {
        const parentChecker = Template.currentData().checker.get();
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

Template.organization_urls_pane.helpers({
    // the full authorization endpoint url
    authorization_example(){
        const endpoint = Template.instance().APP.organization.get().record.authorization_endpoint;
        return endpoint ? pwixI18n.label( I18N, 'organizations.edit.authorization_example', Template.instance().APP.baseUrl.get() + endpoint ) : '&nbsp;';
    },
    // the full dynamic registration endpoint url
    dynamic_example(){
        const endpoint = Template.instance().APP.organization.get().record.registration_endpoint;
        return endpoint ? pwixI18n.label( I18N, 'organizations.edit.dynamic_example', Template.instance().APP.baseUrl.get() + endpoint ) : '&nbsp;';
    },
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },
    // an example of the issuer value
    // using the well-known server discovery url
    issuer_example(){
        return pwixI18n.label( I18N, 'organizations.edit.issuer_example', Template.instance().APP.baseUrl.get() + Meteor.APP.C.oauthMetadataPath );
    },
    // the full jwks page url
    jwks_example(){
        const endpoint = Template.instance().APP.organization.get().record.jwks_uri;
        return endpoint ? pwixI18n.label( I18N, 'organizations.edit.jwks_example', Template.instance().APP.baseUrl.get() + endpoint ) : '&nbsp;';
    },
    // the full token endpoint url
    token_example(){
        const endpoint = Template.instance().APP.organization.get().record.token_endpoint;
        return endpoint ? pwixI18n.label( I18N, 'organizations.edit.token_example', Template.instance().APP.baseUrl.get() + endpoint ) : '&nbsp;';
    }
});
