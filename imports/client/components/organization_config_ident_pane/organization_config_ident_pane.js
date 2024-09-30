/*
 * /imports/client/components/organization_config_ident_pane/organization_config_ident_pane.js
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

import '/imports/client/components/howcount_select/howcount_select.js';

import './organization_config_ident_pane.html';

Template.organization_config_ident_pane.onCreated( function(){
    const self = this;

    self.APP = {
        emailFields: {
            identitiesEmailAddressesHow: {
                js: '.js-email-how',
                form_status: Forms.C.ShowStatus.NONE
            },
            identitiesEmailAddressesCount: {
                js: '.js-email-count',
                form_status: Forms.C.ShowStatus.NONE
            },
            identitiesEmailAddressesIdentifier: {
                js: '.js-email-identifier',
                form_status: Forms.C.ShowStatus.NONE
            }
        },
        usernameFields: {
            identitiesUsernamesHow: {
                js: '.js-username-how',
                form_status: Forms.C.ShowStatus.NONE
            },
            identitiesUsernamesCount: {
                js: '.js-username-count',
                form_status: Forms.C.ShowStatus.NONE
            },
            identitiesUsernamesIdentifier: {
                js: '.js-username-identifier',
                form_status: Forms.C.ShowStatus.NONE
            }
        },
        // the current { entity, record } organization object
        organization: new ReactiveVar( null ),
        // a Checker instance for the emails
        emailChecker: new ReactiveVar( null ),
        // a status RV for the status of the email addresses
        emailRv: new ReactiveVar( null ),
        // a Checker instance for the usernames
        usernameChecker: new ReactiveVar( null ),
        // a status RV for the status of the usernames
        usernameRv: new ReactiveVar( null )
    };

    // maintain the current { entity, record } organization object
    self.autorun(() => {
        const entity = Template.currentData().entity.get();
        const record = entity.DYN.records[Template.currentData().index].get();
        self.APP.organization.set({ entity: entity, record: record });
    });

    // setup some default values in the organization record (must be same than those defined in fieldset)
    self.autorun(() => {
        const dataContext = Template.currentData();
        const entity = dataContext.entity.get();
        let record = entity.DYN.records[dataContext.index].get();
        if( !Object.keys( record ).includes( 'identitiesEmailAddressesHow' )){
            record.identitiesEmailAddressesHow = 'least';
        }
        if( !Object.keys( record ).includes( 'identitiesEmailAddressesCount' )){
            record.identitiesEmailAddressesCount = 1;
        }
        if( !Object.keys( record ).includes( 'identitiesEmailAddressesIdentifier' )){
            record.identitiesEmailAddressesIdentifier = false;
        }
        if( !Object.keys( record ).includes( 'identitiesUsernamesHow' )){
            record.identitiesUsernamesHow = 'least';
        }
        if( !Object.keys( record ).includes( 'identitiesUsernamesCount' )){
            record.identitiesUsernamesCount = 1;
        }
        if( !Object.keys( record ).includes( 'identitiesUsernamesIdentifier' )){
            record.identitiesUsernamesIdentifier = false;
        }
    });
});

Template.organization_config_ident_pane.onRendered( function(){
    const self = this;
    const dataContext = Template.currentData();

    // initialize a Checker for the EmailAddresses panel as soon as we get the parent Checker
    self.autorun(() => {
        const parentChecker = Template.currentData().checker?.get();
        const checker = self.APP.emailChecker.get();
        if( parentChecker && !checker ){
            self.APP.emailChecker.set( new Forms.Checker( self, {
                parent: parentChecker,
                panel: new Forms.Panel( self.APP.emailFields, TenantsManager.Records.fieldSet.get()),
                data: {
                    entity: Template.currentData().entity,
                    index: Template.currentData().index
                },
                setForm: Template.currentData().entity.get().DYN.records[Template.currentData().index].get()
            }));
        }
    });

    // initialize a Checker for the Usernames panel as soon as we get the parent Checker
    self.autorun(() => {
        const parentChecker = Template.currentData().checker?.get();
        const checker = self.APP.usernameChecker.get();
        if( parentChecker && !checker ){
            self.APP.usernameChecker.set( new Forms.Checker( self, {
                parent: parentChecker,
                panel: new Forms.Panel( self.APP.usernameFields, TenantsManager.Records.fieldSet.get()),
                data: {
                    entity: Template.currentData().entity,
                    index: Template.currentData().index
                },
                setForm: Template.currentData().entity.get().DYN.records[Template.currentData().index].get()
            }));
        }
    });

    // track the email status
    self.autorun(() => {
        const checker = self.APP.emailChecker.get();
        if( checker ){
            self.APP.emailRv.set( checker.status());
        }
    });

    // track the username status
    self.autorun(() => {
        const checker = self.APP.usernameChecker.get();
        if( checker ){
            self.APP.usernameRv.set( checker.status());
        }
    });
});

Template.organization_config_ident_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },
    // parms for email status
    parmsEmailStatus(){
        return {
            statusRv: Template.instance().APP.usernameRv
        };
    },
    // parms for username status
    parmsUsernameStatus(){
        return {
            statusRv: Template.instance().APP.usernameRv
        };
    }
});
