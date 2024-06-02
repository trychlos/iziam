/*
 * /imports/client/init/routes.js
 *
 * As a general rule, the route to a page is configured as a property of the corresponding DisplayUnit instance.
 * We define here these configured routes againts our router.
 */

import { BlazeLayout } from 'meteor/pwix:blaze-layout';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

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
                BlazeLayout.render( 'app_main', { dataContext: { name: name }});
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
