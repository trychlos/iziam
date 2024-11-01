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
import { strict as assert } from 'node:assert';

import { pwixI18n } from 'meteor/pwix:i18n';
import { WebApp } from 'meteor/webapp';

import { Webargs } from '/imports/server/classes/webargs.class.js';

// global (non-scoped) REST API
//  As a design decision, all global REST API must start with /vnn
const globalApi = {
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

// @async
// @param {Object} it the 'globalApi' object item containing the path and the function...
// @param {WebArgs} args
// @returns {Boolean} whether we have ended the request,
async function v1_listCommands( it, args ){
    let res = { result: [] };
    globalApi.GET.forEach(( it ) => {
        if( it.path !== '/v1' ){
            res.result.push( it.path );
        }
    });
    args.answer( res );
    args.end();
    return true;
}

async function v1_ident( it, args ){
    args.answer({
        id: Meteor.APP.name,
        lastUpdate: Meteor.settings.public[Meteor.APP.name].version,
        label: pwixI18n.label( I18N, 'app.label' )
    });
    args.end();
    return true;
}

// Handle global requests, i.e. requests whose first level is not scoped to a particular organization
//  they should still have a recognizable first level as /vnn
//  return true|false whether we have (at least tried to) handled this request
async function handleGlobals( req, res ){
    const words = req.url.split( '/' );
    assert( !words[0], 'expects an absolute pathname, got '+req.url );
    let found = false;
    if( words[1].match( /^v[\d]+$/ )){
        found = true;
        // the request matches a REST global request - it must be considered as handled, try to answer it
        await new Webargs( req, res ).handle( globalApi );
    }
    return found;
}

// this global handler see all application urls, including both the UI part and the REST part
WebApp.handlers.use( async ( req, res, next ) => {
    handleGlobals( req, res ).then(( handled ) => {
        if( !handled ){
            next();
        }
    });
});
