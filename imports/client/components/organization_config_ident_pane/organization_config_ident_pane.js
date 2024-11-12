/*
 * /imports/client/components/organization_config_ident_pane/organization_config_ident_pane.js
 *
 * NOTE: this panel is disabled as soon as we have created the first identity.
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

import '/imports/client/components/howcount_select/howcount_select.js';

import './organization_config_ident_pane.html';

Template.organization_config_ident_pane.onCreated( function(){
    const self = this;

    self.APP = {
        fields: {
            identitiesEmailAddressesMinHow: {
                js: '.js-email-min-how'
            },
            identitiesEmailAddressesMinCount: {
                js: '.js-email-min-count',
                formTo( $node, item ){
                    $node.val( item.identitiesEmailAddressesMinHow === 'nospec' ? '' : item.identitiesEmailAddressesMinCount );
                }
            },
            identitiesEmailAddressesMaxHow: {
                js: '.js-email-max-how'
            },
            identitiesEmailAddressesMaxCount: {
                js: '.js-email-max-count',
                formTo( $node, item ){
                    $node.val( item.identitiesEmailAddressesMaxHow === 'nospec' ? '' : item.identitiesEmailAddressesMaxCount );
                }
            },
            identitiesEmailAddressesIdentifier: {
                js: '.js-email-identifier'
            },
            identitiesUsernamesMinHow: {
                js: '.js-username-min-how'
            },
            identitiesUsernamesMinCount: {
                js: '.js-username-min-count',
                formTo( $node, item ){
                    $node.val( item.identitiesUsernamesMinHow === 'nospec' ? '' : item.identitiesUsernamesMinCount );
                }
            },
            identitiesUsernamesMaxHow: {
                js: '.js-username-max-how'
            },
            identitiesUsernamesMaxCount: {
                js: '.js-username-max-count',
                formTo( $node, item ){
                    $node.val( item.identitiesUsernamesMaxHow === 'nospec' ? '' : item.identitiesUsernamesMaxCount );
                }
            },
            identitiesUsernamesIdentifier: {
                js: '.js-username-identifier'
            }
        },
        // the current { entity, record } organization object
        organization: new ReactiveVar( null ),
        // whether we have at least already one identity (and this panel is disabled)
        haveIdentity: new ReactiveVar( false ),
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
        self.APP.haveIdentity.set( entity.DYN.identitiesCount > 0 );
    });

    // setup some default values in the organization record (must be same than those defined in fieldset)
    self.autorun(() => {
        const dataContext = Template.currentData();
        const entity = dataContext.entity.get();
        let record = entity.DYN.records[dataContext.index].get();
        if( !Object.keys( record ).includes( 'identitiesEmailAddressesMinHow' )){
            record.identitiesEmailAddressesMinHow = 'least';
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
                fieldStatusShow: false,
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
    // disable the email address identifier checkbox
    emailIdentifierDisabled(){
        return Template.instance().APP.haveIdentity.get() ? 'disabled' : '';
    },
    // disable the email address max count when min how is exactly or max how is not specified
    emailMaxCountDisabled(){
        const minhow = this.entity.get().DYN.records[this.index].get().identitiesEmailAddressesMinHow;
        const maxhow = this.entity.get().DYN.records[this.index].get().identitiesEmailAddressesMaxHow;
        return minhow === 'exactly' || maxhow === 'nospec' ? 'disabled' : '';
    },
    // disable the email address min count
    emailMinCountDisabled(){
        return Template.instance().APP.haveIdentity.get() ? 'disabled' : '';
    },
    // display just on top of the input panels a short text which explain why the panels are disabled or when they will be
    identityTop( arg ){
        const label = Template.instance().APP.haveIdentity.get() ? 'ident_disabled' : 'ident_enabled';
        return pwixI18n.label( I18N, 'organizations.edit.'+label );
    },
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },
    // for label
    itFor( label ){
        return 'organization_config_ident_'+label+'_'+this.index;
    },
    // parms for email max how count
    parmsEmailMaxHow(){
        return {
            selected: this.entity.get().DYN.records[this.index].get().identitiesEmailAddressesMaxHow,
            disabled: Template.instance().APP.haveIdentity.get() || this.entity.get().DYN.records[this.index].get().identitiesEmailAddressesMinHow === 'exactly',
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
    parmsEmailMinHow(){
        return {
            selected: this.entity.get().DYN.records[this.index].get().identitiesEmailAddressesMinHow,
            disabled: Template.instance().APP.haveIdentity.get()
        };
    },
    // parms for email min status
    parmsEmailMinStatus(){
        return {
            statusRv: Template.instance().APP.emailMinRv
        };
    },
    // parms for username max how count
    parmsUsernameMaxHow(){
        return {
            selected: this.entity.get().DYN.records[this.index].get().identitiesUsernamesMaxHow,
            disabled: Template.instance().APP.haveIdentity.get() || this.entity.get().DYN.records[this.index].get().identitiesUsernamesMinHow === 'exactly',
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
    parmsUsernameMinHow(){
        return {
            selected: this.entity.get().DYN.records[this.index].get().identitiesUsernamesMinHow,
            disabled: Template.instance().APP.haveIdentity.get()
        };
    },
    // parms for username min status
    parmsUsernameMinStatus(){
        return {
            statusRv: Template.instance().APP.usernameMinRv
        };
    },
    // disable the username identifier checkbox
    usernameIdentifierDisabled(){
        return Template.instance().APP.haveIdentity.get() ? 'disabled' : '';
    },
    // disable the username max count when min how is exactly or max how is not specified
    usernameMaxCountDisabled(){
        const minhow = this.entity.get().DYN.records[this.index].get().identitiesUsernamesMinHow;
        const maxhow = this.entity.get().DYN.records[this.index].get().identitiesUsernamesMaxHow;
        return minhow === 'exactly' || maxhow === 'nospec' ? 'disabled' : '';
    },
    // disable the username min count
    usernameMinCountDisabled(){
        return Template.instance().APP.haveIdentity.get() ? 'disabled' : '';
    }
});

Template.organization_config_ident_pane.events({
    'keypress .js-email-min-count'( event, instance ){
        var charCode = ( event.which) ? event.which : event.keyCode
        if( charCode > 31 && ( charCode < 48 || charCode > 57 )){
            return false;
        }
        return true;
    }
});
