/*
 * /imports/server/init/webapp-express.js
 *
 * Instanciates the express application.
 */

import { WebApp } from 'meteor/webapp';

Meteor.APP.express = WebApp.express();
WebApp.handlers.use( Meteor.APP.express );
