/*
 * /imports/client/components/identity_addresses_pane/identity_addresses_pane.js
 *
 * Identity addresses pane.
 * 
 * Parms:
 * - item: a ReactiveVar which holds the identity object to edit (may be empty, but not null)
 * - checker: a ReactiveVar which holds the parent Checker
 * - amInstance: a ReactiveVar which holds the amClass instance
 * - organization: the Organization as an entity with its DYN.records array
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';
import { Random } from 'meteor/random';

import { Identities } from '/imports/common/collections/identities/index.js';

import '/imports/client/components/identity_address_row/identity_address_row.js';

import './identity_addresses_pane.html';

Template.identity_addresses_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // addresses list
    itemsList(){
       return this.item.get().addresses || [];
    },

    // passes the same data context, just adding our item
    parmsAddressRow( it ){
        return {
            ...this,
            it: it
        };
    },

    // enabled as soon as something is set in the last one
    plusDisabled(){
        const addresses = this.item.get().addresses || [];
        const address = addresses.length ? addresses[addresses.length-1] : null;
        return !address || !Identities.fn.addressEmpty( address ) ? '' : 'disabled'
    }
});

Template.identity_addresses_pane.events({
    'click .c-identity-addresses-pane .js-plus'( event, instance ){
        const item = this.item.get();
        item.addresses = item.addresses || [];
        item.addresses.push({
            _id: Random.id()
        });
        this.item.set( item );
    }
});
