/*
 * /imports/client/init/display-units.js
 * 
 * Instanciate here the DisplayUnit's of the application, and some of their relevant properties.
 */

import { DisplaySet } from '../classes/display-set.class.js';
import { DisplayUnit } from '../classes/display-unit.class.js';

Meteor.APP.displaySet = new DisplaySet( Meteor.APP.displayUnits, {
    unitFn: DisplayUnit
});
