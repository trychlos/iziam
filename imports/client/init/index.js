/*
 * /imports/client/init/index.js
 *
 *  Client-only UI init code.
 *  All third-party imports go here.
 */

import '/imports/common/init/index.js';

import { AppClient } from '../classes/app-client.class';

//import './datepicker.js';
//import './last-connection.js';
//import './organization-context.js';
//import './pages.js';
//import './ready.js';
//import './routes.js';
//import './run.js';
//import './startup.js';
//import './tolert.js';

Meteor.APP = new AppClient();
Meteor.APP.run();
