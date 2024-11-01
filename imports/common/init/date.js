/*
 * /imports/common/init/date.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { DateJs } from 'meteor/pwix:date';

DateJs.configure({
    // verbosity: DateJs.C.Verbose.CONFIGURE
});
