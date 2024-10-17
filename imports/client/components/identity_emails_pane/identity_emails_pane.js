/*
 * /imports/client/components/identity_emails_pane/identity_emails_pane.js
 *
 * Identity emails pane.
 * 
 * Parms:
 * - item: a ReactiveVar which holds the identity object to edit (may be empty, but not null)
 * - checker: a ReactiveVar which holds the parent Checker
 * - amInstance: a ReactiveVar which holds the amClass instance
 * - organization: the Organization as an entity with its DYN.records array
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';
import { Random } from 'meteor/random';
import { ReactiveVar } from 'meteor/reactive-var';

import { Identities } from '/imports/common/collections/identities/index.js';
import { Organizations } from '/imports/common/collections/organizations/index.js';

import '/imports/client/components/identity_email_row/identity_email_row.js';

import './identity_emails_pane.html';

Template.identity_emails_pane.onCreated( function(){
    const self = this;

    self.APP = {
        emailsCount: new ReactiveVar( 0 ),
        maxCount: -1
    };

    // keep the count of email addresses up to date
    self.autorun(() => {
        const item = Template.currentData().item.get();
        self.APP.emailsCount.set(( item.emails || [] ).length );
    });

    // have the max count allowed by the organization (or -1 if not relevant)
    self.autorun(() => {
        self.APP.maxCount = Organizations.fn.maxEmailAddressesCount( Template.currentData().organization );
    });

    // tracking the count of email addresses
    self.autorun(() => {
        //console.debug( 'emailsCount', self.APP.emailsCount.get());
    });
});

Template.identity_emails_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // emails addresses list
    itemsList(){
        const count = Template.instance().APP.emailsCount.get();
        return this.item.get().emails || [];
    },

    // passes the same data context, just adding our item
    parmsEmailRow( it ){
        return {
            ...this,
            emailsCount: Template.instance().APP.emailsCount,
            it: it
        };
    },

    // disable the plus button when we have reached the max count of email addresses allowed by the organization
    plusDisabled(){
        const maxCount = Template.instance().APP.maxCount;
        const count = Template.instance().APP.emailsCount.get();
        const emails = this.item.get().emails || [];
        const email = emails.length ? emails[emails.length-1] : null;
        return ( !email || !Identities.fn.emailEmpty( email ) || maxCount === -1 || maxCount > count ) ? '' : 'disabled';
    }
});

Template.identity_emails_pane.events({
    'click .c-identity-emails-pane .js-plus'( event, instance ){
        const item = this.item.get();
        item.emails = item.emails || [];
        item.emails.push({
            _id: Random.id()
        });
        this.item.set( item );
    }
});
