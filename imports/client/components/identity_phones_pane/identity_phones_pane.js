/*
 * /imports/client/components/identity_phones_pane/identity_phones_pane.js
 *
 * Identity phones pane.
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

import { Identities } from '/imports/common/collections/identities/index.js';

import '/imports/client/components/identity_phone_row/identity_phone_row.js';

import './identity_phones_pane.html';

Template.identity_phones_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // phones addresses list
    itemsList(){
        return this.item.get().phones || [];
    },

    // passes the same data context, just adding our item
    parmsPhoneRow( it ){
        return {
            ...this,
            it: it
        };
    },

    // disable the plus button if the last phone is not set
    plusDisabled(){
        const phones = this.item.get().phones || [];
        const phone = phones.length ? phones[phones.length-1] : null;
        return ( !phone || !Identities.fn.phoneEmpty( phone )) ? '' : 'disabled';
    }
});

Template.identity_phones_pane.events({
    'click .c-identity-phones-pane .js-plus'( event, instance ){
        const item = this.item.get();
        item.phones = item.phones || [];
        item.phones.push({
            _id: Random.id()
        });
        this.item.set( item );
    }
});
