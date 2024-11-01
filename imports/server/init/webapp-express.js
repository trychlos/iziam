/*
 * /imports/server/init/webapp-express.js
 *
 * Instanciates the express application.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { WebApp } from 'meteor/webapp';

Meteor.APP.express = WebApp.express();
WebApp.handlers.use( Meteor.APP.express );

// this global handler see all application urls, including both the UI part and the REST part
if( false ){
    WebApp.handlers.use( async ( req, res, next ) => {
        console.debug( 'webapp-express handlers.use', req.method, req.url );
        next();
    });
}
