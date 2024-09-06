/*
 * /imports/server/init/webapp-rest-scoped.js
 *
 * Handle here organization-scoped (non global) REST requests as "<baseUrl>/xxxx".
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { pwixI18n } from 'meteor/pwix:i18n';
import { Validity } from 'meteor/pwix:validity';
import { WebApp } from 'meteor/webapp';

import { Organizations } from '/imports/common/collections/organizations/index.js';

import { Webargs } from '/imports/server/classes/webargs.class.js';

// organization-scoped REST API
const scoped = {
    GET: [
        // entry point of the global REST API -> just list the available commands
        {
            path: '/.well-known',
            fn: fn_wellKnown
        },
        // an example of a command
        {
            path: '/v1/ident',
            fn: v1_ident
        }
    ]
}

// it: the globals object containing the path, the function...
// args: the Webargs object
// record: the at date organization record
function fn_wellKnown( it, args, record ){
    args.answer({ result: 'OK' });
}

function v1_ident( it, args, record ){
    args.answer({
        id: Meteor.APP.name,
        lastUpdate: Meteor.settings.public[Meteor.APP.name].version,
        label: pwixI18n.label( I18N, 'app.label' )
    });
}

// Handle organization-scoped requests, i.e. requests whose first level is the base URL of an organization
//  return true|false whether we have (at least tried to) handled this request
async function handleScoped( req, res ){
    const words = req.url.split( '/' );
    assert( !words[0], 'expects an absolute pathname, got '+req.url );
    const baseUrl = '/'+words[1];
    return Organizations.s.getBy({ baseUrl: baseUrl }).then(( fetched ) => {
        // if no organization has this base url, then do not handled
        if( fetched.records.length === 0 ){
            return false;
        }
        // in all other cases, this must be considered as handled
        let args = new Webargs( req, res );
        // if at least one record, count the distinct entities (should be only one else there is an error is the checks.baseUrl() function)
        let entities = {};
        fetched.records.map( it => entities[it.entity] = true );
        if( Object.keys( entities ).length !== 1 ){
            args.error( 'more than one entity handles the requested base URL "'+baseUrl+"'" );
            args.status( 500 ); // server error
            args.end();
        } else {
            const atdate = Validity.atDateByRecords( fetched.records );
            if( !atdate ){
                args.error( 'the requested organization is not valid' );
                args.status( 500 ); // server error
                args.end();
            } else {
                let url = req.url;
                url = 
                args.handle( scoped, {
                    record: atdate,
                    url: req.url.substr( baseUrl.length )
                });
            }
        }
        return true;
    });
}

// this global handler see all application urls, including both the UI part and the REST part
WebApp.handlers.use( async ( req, res, next ) => {
    handleScoped( req, res ).then(( handled ) => {
        if( !handled ){
            next();
        }
    });
});
