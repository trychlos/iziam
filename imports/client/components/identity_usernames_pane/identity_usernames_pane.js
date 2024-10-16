/*
 * /imports/client/components/identity_usernames_pane/identity_usernames_pane.js
 *
 * Identity usernames pane.
 * 
 * Parms:
 * - item: a Reactive Var which contains the identity object to edit (may be empty, but not null)
 * - entityChecker: the EntityChecker attached to the dialog
 * - amInstance: a ReactiveVar which holds the amClass instance
 * - organization: the Organization as an entity with its DYN.records array
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';
import { Random } from 'meteor/random';
import { ReactiveVar } from 'meteor/reactive-var';

import { Organizations } from '/imports/common/collections/organizations/index.js';

import '/imports/client/components/identity_username_row/identity_username_row.js';

import './identity_usernames_pane.html';

Template.identity_usernames_pane.onCreated( function(){
    const self = this;

    self.APP = {
        usernamesCount: new ReactiveVar( 0 ),
        maxCount: -1,
    };

    // keep the count of usernames up to date
    self.autorun(() => {
        const item = Template.currentData().item.get();
        self.APP.usernamesCount.set(( item.usernames || [] ).length );
    });

    // have the max count allowed by the organization (or -1 if not relevant)
    self.autorun(() => {
        self.APP.maxCount = Organizations.fn.maxUsernamesCount( Template.currentData().organization );
    });

    // tracking the count of usernames
    self.autorun(() => {
        //console.debug( 'usernamesCount', self.APP.usernamesCount.get());
    });
});

Template.identity_usernames_pane.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // usernames list
    itemsList(){
        const count = Template.instance().APP.usernamesCount.get();
        return this.item.get().usernames || [];
    },

    // passes the same data context, just replacing the parent checker by our own
    parmsUsernameRow( it ){
        const parms = { ...this };
        parms.usernamesCount = Template.instance().APP.usernamesCount;
        parms.it = it;
        return parms;
    },

    // disable the plus button when we have reached the max count of usernames allowed by the organization
    plusDisabled(){
        const maxCount = Template.instance().APP.maxCount;
        const count = Template.instance().APP.usernamesCount.get();
        return ( maxCount === -1 || maxCount > count ) ? '' : 'disabled';
    }
});

Template.identity_usernames_pane.events({
    'click .c-identity-usernames-pane .js-plus'( event, instance ){
        //console.debug( 'click.js-plus' );
        const item = this.item.get();
        item.usernames = item.usernames || [];
        item.usernames.push({
            _id: Random.id()
        });
        this.item.set( item );
    }
});
