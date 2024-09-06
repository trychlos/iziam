/*
 * /imports/server/init/webapp-oauth.js
 *
 * Handle here OAuth REST requests:
 * - /v[xx] as non-scoped (global) REST requests against the application itself
 * - [baseUrl] as scoped (organization-level) REST requests
 * 
 * Other requests are supposed to be UI requests, and are ignored here.
 *
 ***
 *** IMPORTANT NOTE: both at the globals level than at an organization-scoped level, REST URL's share the same namespace that UI routes.
 *** But, while UI routes and global REST URL's are hardcoded, organization-scoped URL's depend of the REST base URL of each organization.
 *** This is the rule of the ReservedWords common object to let the application check that each URL will stay unique, and this is checked
 *** when updating the baseUrl field of each organization record.
 ***
 * 
 * As we are a multi-tenants app, requests are adressed to /<base_path>/<documented_path>
 * e.g.
 *  GET https://trychlos.org/my_base_url/.well-known/ext-openid-configuration
 *
 * See:
 * - https://datatracker.ietf.org/doc/html/rfc6749
 * - https://datatracker.ietf.org/doc/html/rfc6750
 * - https://datatracker.ietf.org/doc/html/rfc7591
 * - https://datatracker.ietf.org/doc/html/rfc7592
 * - https://ext-openid.net/specs/ext-openid-connect-core-1_0.html
 * - https://ext-openid.net/specs/ext-openid-connect-discovery-1_0.html
 *
 * Test with
 *  curl --no-progress-meter --verbose http://localhost:3000/a/.well-known/ext-openid-configuration | jq
 *  curl --no-progress-meter --verbose --header 'X-izDate-Key: 1234' 'http://localhost:3000/api/v2/date?timezone=Europe/Paris&format=%y%m%d' | jq
 * 
 * headers: {
 *     'x-forwarded-host': 'localhost:3000',
 *     'x-forwarded-proto': 'http',
 *     'x-forwarded-port': '3000',
 *     'x-forwarded-for': '127.0.0.1',
 *     accept: '* / *',
 *     'user-agent': 'curl/8.0.1',
 *     host: 'localhost:3000',
 *     connection: 'keep-alive'
 *   }
 * 
 * https://www.smashingmagazine.com/2018/01/understanding-using-rest-api/
 *  root-endpoint : ROOL_URL
 * 
 * In this file in particular, and other API handlers elsewhere, args is an object as:
 *   let args = {
 *      // input parms
 *      req: req,
 *      res: res,
 *      next: next,
 *      // working parms
 *      // handled is true when we have found a target organization based on the first level of path
 *      handled: false,
 *      url: {
 *          base: the baseUrl part of the path
 *          endpoint: the rest of the path, so our target endpoint
 *          query: an array of { name: value }
 *      }
 *      organization: <the atDate organization which is expected to handle the request>
 *      // ok is true when the organization has successfully handled and answered the request
 *      ok: false
 *      err: null   // an optional string error message which will be logged in Statistics
 *  }
 */

import { WebApp } from 'meteor/webapp';

// non-scoped REST API
//  As a design decision, all global REST API must start with /vnn
const globals = {
    GET: [
        {
            path: '/v1'
        }
    ]
}

// scoped API: the first level belongs to an organization
//  these paths are handled (tested for handling) before oidc-provider has a change to handle its own endpoints
const scoped = {
    DELETE: [
    ],
    GET: [
        {
            path: '/my-well-knowns/configurations',
            fn: org_app_configuration
        },
        {
            path: '/my-openid-configuration',
            fn: my_openid
        }
    ],
    POST: [
    ],
    PUT: [
    ]
};

// answer to the client
//  simultaneously recording a statistic log

function _answer_end( args ){
    //console.log( answer );
    if( args.answer ){
        args.answer[Meteor.APP.name] = Meteor.settings.public[Meteor.APP.name].version;
    }
    if( !args.res.statusCode ){
        args.res.statusCode = 200;
    }
    args.res.setHeader( 'Content-Type', 'application/json' );
    const answerStr = args.answer ? JSON.stringify( args.answer ) : null;
    let stat = {
        request: args.req.url,
        headers: args.req.headers,
        createdBy: args.organization ? args.organization.entity : null,
        status: args.res.statusCode,
        returned: answerStr,
        ip: args.req.headers['x-forwarded-for'],
        errmsg: args.err || null
    };
    Statistics.s.record( stat );
    args.res.end( answerStr );
    return args;
}

function _answer_or_next( args ){
    if( !args.handled ){
        args.next();
    } else {
        if( !args.ok && !args.res.statusCode ){
            args.res.statusCode = 400; // Bad Request
        }
        _answer_end( args );
    }
}

// GET /<baseurl>/.well-known/ext-openid-configuration
function org_app_configuration( args ){
    return Promise.resolve( args )
        .then(() => {
            console.debug( 'org_app_configuration for', args.organization.label );
            const answer = Meteor.APP.ExtOpenID.configuration( args.organization );
            console.debug( answer );
            if( answer.res ){
                args.answer = answer.res;
                args.ok = true;
                return _answer_end( args );
            } else {
                args.err = answer.err;
                return args;
            }
        });
}

// GET /<baseurl>/my-openid
//  just an example of how we can manage a scoped url not handled by oidc-provider
function my_openid( args ){
    return Promise.resolve( args )
        .then(() => {
            console.debug( 'my_openid for', args.organization.label );
            return args;
        });
}

// Handle global requests, i.e. requests whose first level is not scoped to a particular organization
//  they should still have a recognizable first level
//  return a Promise with same (though updated) args object
function _handleGlobals( args ){
    //console.debug( 'trying to handle Globals' );
    return Promise.resolve( args );
}

// Handle organization-scoped requests
//  we would like handle here per-organization requests which are not handled by the openid provider
//  see also https://github.com/panva/node-oidc-provider/blob/main/docs/README.md#pre--and-post-middlewares for the oidc reserved routes
//  return a Promise with same (though updated) args object
//  the request is considered handled (from the webapp handlers point of view) as soon as we have identified an organization and the requested scoped path
// Please note that this middleware has been declared with baseUrl route, so this part has been eaten from the url
function _handleScoped( args ){
    let promise = Promise.resolve( args );
    const org = Meteor.APP.Validity.atDate( Organizations.s.getBy({ baseUrl: args.base }));
    if( org ){
        args.organization = org;
        let found = false;
        if( Object.keys( scoped ).includes( args.req.method )){
            scoped[args.req.method].every(( api ) => {
                if( api.path === args.endpoint ){
                    found = true;
                    handled = true;
                    args.api = api;
                    if( api.fn ){
                        promise = api.fn( args );
                    }
                }
                return found === false;
            });
            args.err = 'no api found for the request';
        } else {
            args.err = 'method not managed';
        }
    }
    return promise;
}

// split an url and returns an object with:
//  - base: the baseUrl path which identifies the organization
//  - endpoint: the rest of path
//  - query: the query arguments as an of { key: value } objects
//  means that we should have at least two slashes to become interested..
//
// URL {
//    href: 'http://localhost:3000/bbb/.well-known/openid-configuration',
//    origin: 'http://localhost:3000',
//    protocol: 'http:',
//    username: '',
//    password: '',
//    host: 'localhost:3000',
//    hostname: 'localhost',
//    port: '3000',
//    pathname: '/bbb/.well-known/openid-configuration',
//    search: '',
//    searchParams: URLSearchParams {},
//    hash: ''
//  }
function _splitUrl( url, host ){
    const o = new URL( url, 'http://'+host );
    const words = o.pathname.split( '/' );
    let res = {
        issuer: o.origin+'/'+words[1],
        base: '/'+words[1],
        endpoint: '/'+words.slice( 2 ).join( '/' ),
        query: []
    };
    o.searchParams.forEach(( value, name, searchParams ) => {
        const o = {};
        o[name] = value;
        res.query.push( o );
    })
    return res;
}

// this global handler see all application urls, including both the UI part and the REST part
WebApp.handlers.use(( req, res, next ) => {
    const o = _splitUrl( req.url, req.headers.host );
    let args = {
        req: req,
        res: res,
        next: next,
        base: o.base,
        endpoint: o.endpoint,
        handled: false,
        ok: false
    };
    res.statusCode = 0;
    Promise.resolve( args )
        .then(() => {
            return _handleGlobals( args );
        })
        .then(() => {
            _answer_or_next( args );
        });
});
