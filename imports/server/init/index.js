/*
 * /imports/server/init/index.js
 */

import '/imports/common/init/index.js';

import { AppServer } from '../classes/app-server.class';

//import './collections.js';
//import './openid.js';
//import './run.js';
//import './startup.js';
//import './webapp-oid.js';
//import './webapp-workaround.js';

Meteor.APP = new AppServer();
Meteor.APP.run();
