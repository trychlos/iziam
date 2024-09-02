/*
 * /imports/client/components/client_redirects_panel/client_redirects_panel.js
 *
 * Manage the redirection URLs of the client.
 * There must be at least one for the client be operational, unless in the UI where we accept no redirect URL at all.
 *
 * Parms:
 * - entity: the currently edited entity as a ReactiveVar
 * - index: the index of the edited record
 * - checker: a ReactiveVar which holds the parent Checker
 * - haveOne: whether to provide an empty row at initialization when there is not yet any redirect url, defaulting to true
 * - enableChecks: whether the checks should be enabled at startup, defaulting to true
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';
import { Random } from 'meteor/random';
import { ReactiveVar } from 'meteor/reactive-var';

import '/imports/client/components/client_redirect_row/client_redirect_row.js';

import './client_redirects_panel.html';

Template.client_redirects_panel.onCreated( function(){
    const self = this;

    self.APP = {
        // current count of redirect urls
        count: new ReactiveVar( 0 ),
        // the Form.Checker instance for this panel
        checker: new ReactiveVar( null ),

        // add an empty item to the redirectUrls array
        addOne( dataContext ){
            const recordRv = dataContext.entity.get().DYN.records[dataContext.index];
            const item = recordRv.get();
            item.redirectUrls = item.redirectUrls || [];
            item.redirectUrls.push({
                id: Random.id()
            });
            recordRv.set( item );
        }
    };

    // keep the count of rows up to date
    self.autorun(() => {
        const entity = Template.currentData().entity.get();
        const index = Template.currentData().index;
        const record = entity.DYN.records[index].get();
        self.APP.count.set(( record.redirectUrls || [] ).length );
    });

    // tracking the count of redirect urls
    self.autorun(() => {
        //console.debug( 'count', self.APP.count.get());
    });
});

Template.client_redirects_panel.onRendered( function(){
    const self = this;

    // initialize the Checker for this panel as soon as we get the parent Checker
    self.autorun(() => {
        const parentChecker = Template.currentData().checker?.get();
        const checker = self.APP.checker.get();
        if( parentChecker && !checker ){
            const enabled = Template.currentData().enableChecks !== false;
            self.APP.checker.set( new Forms.Checker( self, {
                name: 'client_redirects_panel',
                parent: parentChecker,
                enabled: enabled
            }));
        }
    });

    // advertize of the status of this checker to the (maybe) englobing assistant
    self.autorun(() => {
        const checker = self.APP.checker.get();
        if( checker ){
            const status = checker.iStatusableStatus();
            self.$( '.c-client-redirects-panel' ).trigger( 'iz-status', { status: status });            
        }
    });

    // if no redirect url yet, and not configured to not to, have an empty row
    self.autorun(() => {
        const haveOne = Template.currentData().haveOne !== false;
        if( haveOne && !self.APP.count.get()){
            self.APP.addOne( Template.currentData());
        }
    });
});

Template.client_redirects_panel.helpers({
    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // redirect urls list
    itemsList(){
        const count = Template.instance().APP.count.get();
        return this.entity.get().DYN.records[this.index].get().redirectUrls || [];
    },

    // passes the same data context, just replacing the parent checker by our own
    parmsRedirectRow( it ){
        const parms = { ...this };
        parms.checker = Template.instance().APP.checker;
        parms.it = it;
        return parms;
    }
});

Template.client_redirects_panel.events({
    // ask for enabling the checker (when this panel is used inside of an assistant)
    'iz-enable-checks .c-client-redirects-panel'( event, instance, enabled ){
        instance.APP.checker.get().enabled( enabled );
        if( enabled ){
            instance.APP.checker.get().check({ update: false });
        }
    },
    'click .c-client-redirects-panel .js-plus'( event, instance ){
        instance.APP.addOne( this );
    }
});
