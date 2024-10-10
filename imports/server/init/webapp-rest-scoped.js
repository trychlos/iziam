/*
 * /imports/server/init/webapp-rest-scoped.js
 *
 * Handle here organization-scoped (non global) REST requests as "<baseUrl>/xxxx".
 *
 * Test with:
 *  curl --no-progress-meter --verbose http://localhost:3003/mmm/.well-known/oauth-authorization-server | jq
 *  curl --no-progress-meter --verbose http://localhost:3003/mmm/.well-known/openid-configuration | jq
 *  curl --no-progress-meter --verbose --header 'X-izDate-Key: 1234' 'http://localhost:3000/api/v2/date?timezone=Europe/Paris&format=%y%m%d' | jq
 * 
 * To check that the redirect url is working:
 *  curl --no-progress-meter -k --verbose https://slim14.trychlos.lan/_oauth/iziam
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { Validity } from 'meteor/pwix:validity';
import { WebApp } from 'meteor/webapp';

import { Organizations } from '/imports/common/collections/organizations/index.js';

import { IRequestable } from '/imports/common/interfaces/irequestable.iface.js';

import { RequestServer } from '/imports/server/classes/request-server.class.js';
import { Webargs } from '/imports/server/classes/webargs.class.js';

// a map of the instanciated RequestServer's per organization entity
let requestServersByEntities = {};

async function fn_asterPath( url, args, organization, provider ){
    let server = requestServersByEntities[organization.entity._id];
    if( !server ){
        server = new RequestServer( provider, organization, await provider.requestOptions());
        requestServersByEntities[organization.entity._id] = server;
        await server.init();
    }
    server.handle( url, args );
}

// make sure we address only one entity
// returns true if ok
// just be async for code consistency
async function _checkDistinctEntities( args, fetched ){
    let entities = {};
    fetched.records.map( it => entities[it.entity] = true );
    if( Object.keys( entities ).length !== 1 ){
        args.error( '[CODE ERROR] the requested base URL "'+baseUrl+'" is handled by more than one organization' );
        args.status( 500 ); // server error
        args.end();
        return Promise.resolve( false );
    }
    return Promise.resolve( true );
}

// returns the at date organization { entity, record } object if it exists, or null
async function _getOrganizationAtDate( args, fetched ){
    const atdate = Validity.atDateByRecords( fetched.records );
    if( atdate ){
        return Organizations.s.getBy({ _id: atdate.entity }).then(( fetched ) => {
            if( fetched.entities.length !== 1 ){
                args.error( '[CODE ERROR] requesting the organization entity returns '+fetched.entities.length+' document(s)' );
                args.status( 500 ); // server error
                args.end();
                return null;
            } else {
                return { entity: fetched.entities[0], record: atdate };
            }
        });
    } else {
        args.error( 'the requested organization is not valid' );
        args.status( 500 ); // server error
        args.end();
        return null;
    }
}

// check that the { entity, record }  organization object is operational
// returns this same organization if ok, null else
async function _checkOperationalOrganization( args, organization ){
    return Organizations.isOperational( organization ).then(( errors ) => {
        if( errors ){
            errors.map( tm => args.error( tm.iTypedMessageMessage()));
            args.error( 'Organization is not valid' );
            args.status( 500 ); // server error
            args.end();
        }
        return errors ? null : organization;
    });
}

// Handle organization-scoped requests, i.e. requests whose first level is the base URL of an organization
//  return true|false whether we have (at least tried to) handled this request
async function handleScoped( req, res ){
    const words = req.url.split( '/' );
    assert( !words[0], 'expects an absolute pathname, got '+req.url );
    const baseUrl = '/'+words[1];
    const fetched = await Organizations.s.getBy({ baseUrl: baseUrl });
    // if no organization has this base url, then do not handle
    if( fetched.records.length === 0 ){
        return false;
    }
    let args = new Webargs( req, res );
    // make sure all fetched record belong to the same organization entity
    if( !await _checkDistinctEntities( args, fetched )){
        return false;
    }
    // have an organization at date
    const organization = await _getOrganizationAtDate( args, fetched );
    if( !organization ){
        return false;
    }
    // the request can be considered handled as soon as an at-date organization is expected to answer it
    if( !await _checkOperationalOrganization( args, organization )){
        return true;
    }
    const providers = Organizations.fn.byTypeSorted( organization, IRequestable );
    //console.debug( providers );
    //console.debug( req.method, req.url );
    await args.handle( null, {
        organization: organization,
        //url: req.url.substring( baseUrl.length ),
        //url: req.url,
        providers: providers,
        asterCb: fn_asterPath
    });
    return true;
}

// this global handler see all application urls, including both the UI part and the REST part
WebApp.handlers.use( async ( req, res, next ) => {
    handleScoped( req, res ).then(( handled ) => {
        if( !handled ){
            next();
        }
    });
});
