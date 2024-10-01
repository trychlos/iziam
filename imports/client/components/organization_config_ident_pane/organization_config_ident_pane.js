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
        fields: {
            identitiesEmailAddressesMinHow: {
                js: '.js-email-min-how',
                form_status: Forms.C.ShowStatus.NONE
            },
            identitiesEmailAddressesMinCount: {
                js: '.js-email-min-count',
                form_status: Forms.C.ShowStatus.NONE
            },
            identitiesEmailAddressesMaxHow: {
                js: '.js-email-max-how',
                form_status: Forms.C.ShowStatus.NONE
            },
            identitiesEmailAddressesMaxCount: {
                js: '.js-email-max-count',
                form_status: Forms.C.ShowStatus.NONE
            },
            identitiesEmailAddressesIdentifier: {
                js: '.js-email-identifier',
                form_status: Forms.C.ShowStatus.NONE
            },
            identitiesUsernamesMinHow: {
                js: '.js-username-min-how',
                form_status: Forms.C.ShowStatus.NONE
            },
            identitiesUsernamesMinCount: {
                js: '.js-username-min-count',
                form_status: Forms.C.ShowStatus.NONE
            },
            identitiesUsernamesMaxHow: {
                js: '.js-username-max-how',
                form_status: Forms.C.ShowStatus.NONE
            },
            identitiesUsernamesMaxCount: {
                js: '.js-username-max-count',
                form_status: Forms.C.ShowStatus.NONE
            },
            identitiesUsernamesIdentifier: {
                js: '.js-username-identifier',
                form_status: Forms.C.ShowStatus.NONE
            }
        },
        // the current { entity, record } organization object
        organization: new ReactiveVar( null ),
        // the Checker instance for the panel
        checker: new ReactiveVar( null ),
        // a status RV for the status of the email addresses
        emailMinRv: new ReactiveVar( null ),
        emailMaxRv: new ReactiveVar( null ),
        // a status RV for the status of the usernames
        usernameMinRv: new ReactiveVar( null ),
        usernameMaxRv: new ReactiveVar( null )
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
        if( !Object.keys( record ).includes( 'identitiesEmailAddressesMinHow' )){
            record.identitiesEmailAddressesMinHow = 'exactly';
        }
        if( !Object.keys( record ).includes( 'identitiesEmailAddressesMinCount' )){
            record.identitiesEmailAddressesMinCount = 1;
        }
        if( !Object.keys( record ).includes( 'identitiesEmailAddressesMaxHow' )){
            record.identitiesEmailAddressesMaxHow = 'nospec';
        }
        if( !Object.keys( record ).includes( 'identitiesEmailAddressesMaxCount' )){
            record.identitiesEmailAddressesMaxCount = 0;
        }
        if( !Object.keys( record ).includes( 'identitiesEmailAddressesIdentifier' )){
            record.identitiesEmailAddressesIdentifier = true;
        }
        if( !Object.keys( record ).includes( 'identitiesUsernamesMinHow' )){
            record.identitiesUsernamesMinHow = 'least';
        }
        if( !Object.keys( record ).includes( 'identitiesUsernamesMinCount' )){
            record.identitiesUsernamesMinCount = 0;
        }
        if( !Object.keys( record ).includes( 'identitiesUsernamesMaxHow' )){
            record.identitiesUsernamesMaxHow = 'nospec';
        }
        if( !Object.keys( record ).includes( 'identitiesUsernamesMaxCount' )){
            record.identitiesUsernamesMaxCount = 0;
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

    // we have a dedicated status indicator for both min and max email addresses and usernames
    self.autorun(() => {
        const checker = self.APP.checker.get();
        if( checker ){
            self.APP.emailMinRv.set( checker.statusByFields([ 'identitiesEmailAddressesMinHow', 'identitiesEmailAddressesMinCount' ]));
            self.APP.emailMaxRv.set( checker.statusByFields([ 'identitiesEmailAddressesMaxHow', 'identitiesEmailAddressesMaxCount' ]));
            self.APP.usernameMinRv.set( checker.statusByFields([ 'identitiesUsernamesMinHow', 'identitiesUsernamesMinCount' ]));
            self.APP.usernameMaxRv.set( checker.statusByFields([ 'identitiesUsernamesMaxHow', 'identitiesUsernamesMaxCount' ]));
        }
    });
});

Template.organization_config_ident_pane.helpers({
    // disable the email address max count when min how is exactly or max how is not specified
    emailMaxCountDisabled(){
        const minhow = this.entity.get().DYN.records[this.index].get().identitiesEmailAddressesMinHow;
        const maxhow = this.entity.get().DYN.records[this.index].get().identitiesEmailAddressesMaxHow;
        console.debug( 'minhow', minhow, 'maxhow', maxhow );
        return minhow === 'exactly' || maxhow === 'nospec' ? 'disabled' : '';
    },
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },
    // parms for email max how count
    parmsEmailMaxHowCount(){
        return {
            selected: this.entity.get().DYN.records[this.index].get().identitiesEmailAddressesMaxHow,
            disabled: this.entity.get().DYN.records[this.index].get().identitiesEmailAddressesMinHow === 'exactly',
            isMax: true
        };
    },
    // parms for email max status
    parmsEmailMaxStatus(){
        return {
            statusRv: Template.instance().APP.emailMaxRv
        };
    },
    // parms for email min how count
    parmsEmailMinHowCount(){
        return {
            selected: this.entity.get().DYN.records[this.index].get().identitiesEmailAddressesMinHow
        };
    },
    // parms for email min status
    parmsEmailMinStatus(){
        return {
            statusRv: Template.instance().APP.emailMinRv
        };
    },
    // parms for username max how count
    parmsUsernameMaxHowCount(){
        return {
            selected: this.entity.get().DYN.records[this.index].get().identitiesUsernamesMaxHow,
            disabled: this.entity.get().DYN.records[this.index].get().identitiesUsernamesMinHow === 'exactly',
            isMax: true
        };
    },
    // parms for username max status
    parmsUsernameMaxStatus(){
        return {
            statusRv: Template.instance().APP.usernameMaxRv
        };
    },
    // parms for username min how count
    parmsUsernameMinHowCount(){
        return {
            selected: this.entity.get().DYN.records[this.index].get().identitiesUsernamesMinHow
        };
    },
    // parms for username min status
    parmsUsernameMinStatus(){
        return {
            statusRv: Template.instance().APP.usernameMinRv
        };
    },
    // disable the username max count when min how is exactly or max how is not specified
    usernameMaxCountDisabled(){
        const minhow = this.entity.get().DYN.records[this.index].get().identitiesUsernamesMinHow;
        const maxhow = this.entity.get().DYN.records[this.index].get().identitiesUsernamesMaxHow;
        return minhow === 'exactly' || maxhow === 'nospec' ? 'disabled' : '';
    }
});
