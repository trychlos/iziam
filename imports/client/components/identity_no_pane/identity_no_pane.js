/*
 * /imports/client/components/identity_no_pane/identity_no_pane.js
 *
 * A pane to be able to interact with the AccountEditPanel...
 * The pane is not visible, but still created and rendered
 *
 * Parms:
 * - item: a ReactiveVar which holds the identity object to edit (may be empty, but not null)
 * - checker: a ReactiveVar which holds the parent Checker
 * - amInstance: a ReactiveVar which holds the amClass instance
 * - organization: the Organization as an entity with its DYN.records array
 */

import _ from 'lodash';

import { Identities } from '/imports/common/collections/identities/index.js';
import { Organizations } from '/imports/common/collections/organizations/index.js';

import './identity_no_pane.html';

Template.identity_no_pane.onCreated( function(){
    const self = this;
    //console.debug( this );
});

Template.identity_no_pane.onRendered( function(){
    const self = this;
    //console.debug( this );

    // if we have at least one email address (resp. one username), show the tab
    self.autorun(() => {
        const organization = Template.currentData().organization;
        let have = Organizations.fn.haveAtLeastOneEmailAddress( organization );
        //console.debug( 'organization', organization, 'email', have );
        self.$( '.c-identity-no-pane' ).trigger( 'tabbed-do-enable', {
            tabbedId: Template.currentData().tabbedId,
            name: 'identity_emails_tab',
            enabled: have
        });
        have = Organizations.fn.haveAtLeastOneUsername( organization );
        self.$( '.c-identity-no-pane' ).trigger( 'tabbed-do-enable', {
            tabbedId: Template.currentData().tabbedId,
            name: 'identity_usernames_tab',
            enabled: have
        });
    });

    // the parent Checker comes from AccountsEditPanel from AccountsManager
    // install a cross check function
    self.autorun(() => {
        const dc = Template.currentData();
        const checker = dc.checker?.get();
        if( checker ){
            checker.crossCheckFn( Identities.checks.crossHasIdentifier, {
                item: dc.item,
                amInstance: dc.amInstance.get(),
                organization: Validity.getEntityRecord( dc.organization )
            });
        }
    });

    // make sure we have a DYN sub-object on new identities
    self.autorun(() => {
        let item = Template.currentData().item.get();
        item.DYN = item.DYN || {};
    });
});
