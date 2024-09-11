/*
 * /imports/server/init/webapp-rest-global.js
 *
 * Handle here global (non-scoped to an organization) REST requests as "/v[xx]".
 *
 * Test with:
 *  curl --no-progress-meter --verbose http://localhost:3003/v1 | jq
 *  curl --no-progress-meter --verbose http://localhost:3003/v1/ident | jq
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { pwixI18n } from 'meteor/pwix:i18n';
import { WebApp } from 'meteor/webapp';

import { Webargs } from '/imports/server/classes/webargs.class.js';

// non-scoped REST API
//  As a design decision, all global REST API must start with /vnn
const globals = {
    GET: [
        // entry point of the global REST API -> just list the available commands
        {
            path: '/v1',
            fn: v1_listCommands
        },
        // get server identifier
        {
            path: '/v1/ident',
            fn: v1_ident
        }
    ]
}

// it: the globals object containing the path, the function...
// args: the Webargs object
function v1_listCommands( it, args ){
    let res = { result: [] };
    globals.GET.forEach(( it ) => {
        if( it.path !== '/v1' ){
            res.result.push( it.path );
        }
    });
    args.answer( res );
}

function v1_ident( it, args ){
    args.answer({
        id: Meteor.APP.name,
        lastUpdate: Meteor.settings.public[Meteor.APP.name].version,
        label: pwixI18n.label( I18N, 'app.label' )
    });
}

// Handle global requests, i.e. requests whose first level is not scoped to a particular organization
//  they should still have a recognizable first level as /vnn
//  return true|false whether we have (at least tried to) handled this request
function handleGlobals( req, res ){
    const words = req.url.split( '/' );
    assert( !words[0], 'expects an absolute pathname, got '+req.url );
    let found = false;
    if( words[1].match( /^v[\d]+$/ )){
        found = true;
        // the request matches a REST global request - it must be considered as handled, try to answer it
        let args = new Webargs( req, res );
        args.handle( globals );
    }
    return found;
}

// this global handler see all application urls, including both the UI part and the REST part
WebApp.handlers.use(( req, res, next ) => {
    if( !handleGlobals( req, res )){
        next();
    }
});