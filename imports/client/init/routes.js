/*
 * /imports/client/init/routes.js
 *
 * As a general rule, the route to a page is configured as a property of the corresponding DisplayUnit instance.
 * We define here these configured routes againts our router.
 */

import { BlazeLayout } from 'meteor/pwix:blaze-layout';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Permissions } from 'meteor/pwix:permissions';

import '/imports/client/components/app_main/app_main.js';

// https://github.com/veliovgroup/flow-router/wiki
// DISABLE QUERY STRING COMPATIBILITY
// WITH OLDER FlowRouter AND Meteor RELEASES
FlowRouter.decodeQueryParamsOnce = true;

// the main routes to the pages
Meteor.APP.displaySet.enumerate(( name, page ) => {
    const route = page.get( 'route' );
    if( route ){
        FlowRouter.route( route, {
            name: name,
            action(){
                // as the usual rule, users which are not allowed to a page are redirected to home which is expected to be public
                // in izIAM, the app_login component manages a login panel to force the user to connect
                //  so let the code go until app_content
                const contentManaged = true;
                // make sure the current user is allowed (or that the login is managed at app_content level)
                const unit = Meteor.APP.displaySet.byName( name );
                const wantPermission = unit.get( 'wantPermission' );
                Promise.resolve( !wantPermission || Permissions.isAllowed( wantPermission )).then(( allowed ) => {
                    if( allowed || contentManaged ){
                        console.debug( 'BlazeLayout.rendering()', name );
                        BlazeLayout.render( 'app_main', { dataContext: { name: name }});
                    } else {
                        console.warn( 'user appears as not allowed to \''+name+'\'' );
                        FlowRouter.go( '/' );
                    }
                });
            }
        });
    }
    return true;
});

// A catch-all route which redirects to /
FlowRouter.route( '*', {
    action(){
        console.log( 'catch-all route', FlowRouter.current());
        FlowRouter.go( '/' );
    },
});

// on user logout, go back to home
let isConnected = false;
Tracker.autorun(() => {
    if( Meteor.userId()){
        isConnected = true;
    }
});
Tracker.autorun(() => {
    if( isConnected && !Meteor.userId()){
        isConnected = false;
        FlowRouter.go( '/' );
    }
});
