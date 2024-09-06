/*
 * /imports/server/init/webapp-rest-global.js
 *
 * Handle here non-scoped (global) REST requests as "/v[xx]".
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { WebApp } from 'meteor/webapp';

import { Webargs } from '/imports/server/classes/webargs.class.js';

// non-scoped REST API
//  As a design decision, all global REST API must start with /vnn
const globals = {
    GET: [
        // entry point of the global REST API -> just list the available commands
        {
            path: '/v1',
            fn: listCommands
        },
        // an example of a command
        {
            path: '/v1/cmd_a',
            fn: execCmda
        }
    ]
}

// it: the globals object containing the path, the function...
// args: the Webargs object
function listCommands( it, args ){
    args.answer([
        'cmd_a'
    ]);
}

// it: the globals object containing the path, the function...
// args: the Webargs object
function execCmda( it, args ){
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
        // the request matches a REST global request - try to handle it
        let args = new Webargs( req, res );
        if( globals[req.method] ){
            let hasPath = false;
            globals[req.method].every(( it ) => {
                if( req.url === it.path ){
                    hasPath = true;
                    if( it.fn ){
                        it.fn( it, args );
                        args.end();
                    } else {
                        args.error( 'url "'+req.url+'" doesn\'t have any associated function' );
                        args.status( 501 ); // not implemented
                        args.end();
                    }
                }
                return !hasPath;
            });
            if( !hasPath ){
                args.error( 'url "'+req.url+'" is not managed' );
                args.status( 501 ); // not implemented
                args.end();
            }
        } else {
            args.error( 'method "'+req.method+'" not managed' );
            args.status( 501 ); // not implemented
            args.end();
        }
    }
    return found;
}

// this global handler see all application urls, including both the UI part and the REST part
WebApp.handlers.use(( req, res, next ) => {
    if( !handleGlobals( req, res )){
        next();
    }
});
