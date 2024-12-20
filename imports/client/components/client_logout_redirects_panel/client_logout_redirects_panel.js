/*
 * /imports/client/components/client_logout_redirects_panel/client_logout_redirects_panel.js
 *
 * Manage the post logout redirection URLs of the client.
 *
 * Parms:
 * - entity: the currently edited entity as a ReactiveVar
 * - index: the index of the currently edited Client record
 * - checker: a ReactiveVar which holds the parent Checker
 * - organization: the Organization as an entity with its DYN.records array
 * - haveOne: whether to provide an empty row at initialization when there is not yet any redirect url, defaulting to true
 * - enableChecks: whether the checks should be enabled at startup, defaulting to true
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Forms } from 'meteor/pwix:forms';
import { pwixI18n } from 'meteor/pwix:i18n';
import { Random } from 'meteor/random';
import { ReactiveVar } from 'meteor/reactive-var';
import { TM } from 'meteor/pwix:typed-message';

import { GrantType } from '/imports/common/definitions/grant-type.def.js';

import '/imports/client/components/client_logout_redirect_row/client_logout_redirect_row.js';

import './client_logout_redirects_panel.html';

Template.client_logout_redirects_panel.onCreated( function(){
    const self = this;

    self.APP = {
        // current count of redirect urls
        count: new ReactiveVar( 0 ),
        // the Form.Checker instance for this panel
        checker: new ReactiveVar( null ),
        // whether we already have added one empty row at startup
        haveAddedOne: false,
        // whether we have warned about no redirect uri
        warnedNoRedirect: false,

        // add an empty item to the redirect_uris array
        addOne( dataContext ){
            const recordRv = dataContext.entity.get().DYN.records[dataContext.index];
            const item = recordRv.get();
            item.post_logout_redirect_uris = item.post_logout_redirect_uris || [];
            item.post_logout_redirect_uris.push({
                _id: Random.id()
            });
            recordRv.set( item );
            self.APP.haveAddedOne = true;
        },

        // advertise of the checker validity
        advertise( checker ){
            const status = checker.status();
            const validity = checker.validity();
            self.$( '.c-client-logout-redirects-panel' ).trigger( 'iz-checker', { status: status, validity: validity });
        }
    };

    // keep the count of rows up to date
    self.autorun(() => {
        const entity = Template.currentData().entity.get();
        const index = Template.currentData().index;
        const record = entity.DYN.records[index].get();
        self.APP.count.set(( record.post_logout_redirect_uris || [] ).length );
    });
});

Template.client_logout_redirects_panel.onRendered( function(){
    const self = this;

    // initialize the Checker for this panel as soon as we get the parent Checker
    self.autorun(() => {
        const parentChecker = Template.currentData().checker?.get();
        const checker = self.APP.checker.get();
        if( parentChecker && !checker ){
            const enabled = Template.currentData().enableChecks !== false;
            self.APP.checker.set( new Forms.Checker( self, {
                name: 'client_logout_redirects_panel',
                parent: parentChecker,
                enabled: enabled
            }));
        }
    });

    // advertise of the status of this checker to the (maybe) englobing assistant
    self.autorun(() => {
        const checker = self.APP.checker.get();
        if( checker ){
            self.APP.advertise( checker );
        }
    });

    // if no redirect url yet, and not configured to not to, have an empty row
    // if no more redirect url (and already added if asked for), send a warning
    self.autorun(() => {
        if( self.APP.count.get()){
            self.APP.warnedNoRedirect = false;
        } else {
            const haveOne = Template.currentData().haveOne !== false;
            if( haveOne && !self.APP.haveAddedOne ){
                self.APP.addOne( Template.currentData());
            } else if( !self.APP.warnedNoRedirect ){
                //console.warn( 'warning about no redirect');
                const checker = self.APP.checker.get();
                if( checker ){
                    checker.messagerPush( new TM.TypedMessage({
                        level: TM.MessageLevel.C.WARNING,
                        message: pwixI18n.label( I18N, 'clients.checks.redirect_needed' )
                    }));
                    self.APP.warnedNoRedirect = true;
                }
            }
        }
    });
});

Template.client_logout_redirects_panel.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // redirect urls list
    itemsList(){
        const count = Template.instance().APP.count.get();
        return this.entity.get().DYN.records[this.index].get().post_logout_redirect_uris || [];
    },

    // passes the same data context, just replacing the parent checker by our own
    parmsRedirectRow( it ){
        const parms = { ...this };
        parms.checker = Template.instance().APP.checker;
        parms.it = it;
        return parms;
    },

    // whether the plus button is enabled ?
    plusDisabled(){
        const checker = Template.instance().APP.checker.get();
        const valid = checker ? checker.iStatusableValidity() : false;
        return valid ? '' : 'disabled';
    }
});

Template.client_logout_redirects_panel.events({
    // ask for enabling the checker (when this panel is used inside of an assistant)
    'iz-enable-checks .c-client-logout-redirects-panel'( event, instance, enabled ){
        const checker = instance.APP.checker.get();
        if( checker ){
            checker.enabled( enabled );
            if( enabled ){
                 checker.check({ update: false }).then(() => { instance.APP.advertise( checker ); });
            }
        }
        return false;
    },
    'click .c-client-logout-redirects-panel .js-plus'( event, instance ){
        instance.APP.addOne( this );
    }
});
