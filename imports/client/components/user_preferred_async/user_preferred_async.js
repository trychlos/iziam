/*
 * /imports/client/components/user_preferred_async/user_preferred_async.js
 *
 * A component which asynchronously display the preferred label for the provided user id.
 * 
 * Parms:
 * - userId: the user whose preferred label is to be displayed
 */

import { AccountsTools } from 'meteor/pwix:accounts-tools';

import './user_preferred_async.html';

Template.user_preferred_async.onCreated( function(){
    const self = this;

    self.APP = {
        preferredLabel: new ReactiveVar( null )
    };

    // get the preferred label
    self.autorun(() => {
        const userId = Template.currentData().userId;
        if( userId ){
            AccountsTools.preferredLabel( userId ).then(( res ) => {
                self.APP.preferredLabel.set( res.label );
            });
        }
    });
});

Template.user_preferred_async.helpers({
    // display the preferred label
    preferredLabel(){
        return Template.instance().APP.preferredLabel.get();
    }
});
