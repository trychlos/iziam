/*
 * /imports/common/init/date-input.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { DateInput } from 'meteor/pwix:date-input';

DateInput.configure({
    //helpFormat: '%e %b %Y',
    //inputFormat: '%Y-%m-%d',
    //placeholder: 'yyyy-mm-dd',
    //verbosity: DateInput.C.Verbose.CONFIGURE,
    //withHelp: false
});
