/*
 * /client/main.js
 *
 * This is the main entry point of the client-side application.
 * Startup process:
 *
 * /client/main.js (this file)
 *  |
 *  +- /imports/client/init/index.js
 *      |
 *      +- /imports/common/init/index.js
 *      |   |
 *      |   +- ... import global common libraries and definitions
 *      |
 *      +- ... import global client libraries and definitions
 *      |  |
 *      |  +- popper
 *      |  +- Bootstrap js/css
 *      |  +- Fontawesome js
 *      |
 *      +- ./pages.js                          Define pages based on CoreApp classes
 *      +- ./routes.js                         FlowRouter routes
 *      |
 *      +- APP = new AppClient()
 *      +- APP->run()
 *
 * Because an empty ('/') route is defined, the corresponding page is displayed
 * as soon as the route exists in the system.
 */

import '/imports/client/init/index.js';
