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
 * - organization: an { entity , record } organization object
 */

import _ from 'lodash';

import { Organizations } from '/imports/common/collections/organizations/index.js';

import './identity_no_pane.html';

Template.identity_no_pane.onCreated( function(){
    const self = this;
    //console.debug( this );
});

Template.identity_no_pane.onRendered( function(){
    const self = this;
    console.debug( this );

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
        console.debug( 'organization', organization, 'username', have );
        self.$( '.c-identity-no-pane' ).trigger( 'tabbed-do-enable', {
            tabbedId: Template.currentData().tabbedId,
            name: 'identity_usernames_tab',
            enabled: have
        });
    });
});
