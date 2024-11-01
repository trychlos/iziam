/*
 * /imports/client/components/organization_config_ttls_pane/organization_config_ttls_pane.js
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

import { msToSample } from '/imports/common/helpers/ms-to-sample.js';

import './organization_config_ttls_pane.html';

Template.organization_config_ttls_pane.onCreated( function(){
    const self = this;

    self.APP = {
        fields: {
            ttl_AccessToken: {
                js: '.js-access'
            },
            ttl_ClientCredentials: {
                js: '.js-client'
            },
            ttl_Grant: {
                js: '.js-grant'
            },
            ttl_IdToken: {
                js: '.js-idtoken'
            },
            ttl_Interaction: {
                js: '.js-interaction'
            },
            ttl_Session: {
                js: '.js-session'
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
        if( !Object.keys( record ).includes( 'ttl_AccessToken' )){
            record.ttl_AccessToken = Meteor.APP.C.ttl_AccessToken;
        }
        if( !Object.keys( record ).includes( 'ttl_ClientCredentials' )){
            record.ttl_ClientCredentials = Meteor.APP.C.ttl_ClientCredentials;
        }
        if( !Object.keys( record ).includes( 'ttl_Grant' )){
            record.ttl_Grant = Meteor.APP.C.ttl_Grant;
        }
        if( !Object.keys( record ).includes( 'ttl_IdToken' )){
            record.ttl_IdToken = Meteor.APP.C.ttl_IdToken;
        }
        if( !Object.keys( record ).includes( 'ttl_Interaction' )){
            record.ttl_Interaction = Meteor.APP.C.ttl_Interaction;
        }
        if( !Object.keys( record ).includes( 'ttl_Session' )){
            record.ttl_Session = Meteor.APP.C.ttl_Session;
        }
    });
});

Template.organization_config_ttls_pane.onRendered( function(){
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

Template.organization_config_ttls_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // access token ttl
    ttlAccess(){
        return msToSample( this.entity.get().DYN.records[this.index].get().ttl_AccessToken );
    },

    // client credentials ttl
    ttlClient(){
        return msToSample( this.entity.get().DYN.records[this.index].get().ttl_ClientCredentials );
    },

    // grant ttl
    ttlGrant(){
        return msToSample( this.entity.get().DYN.records[this.index].get().ttl_Grant );
    },

    // ID token ttl
    ttlIdToken(){
        return msToSample( this.entity.get().DYN.records[this.index].get().ttl_IdToken );
    },

    // interaction ttl
    ttlInteraction(){
        return msToSample( this.entity.get().DYN.records[this.index].get().ttl_Interaction );
    },

    // session ttl
    ttlSession(){
        return msToSample( this.entity.get().DYN.records[this.index].get().ttl_Session );
    }
});
