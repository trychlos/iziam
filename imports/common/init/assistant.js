/*
 * /imports/common/init/assistant.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Assistant } from 'meteor/pwix:assistant';

Assistant.configure({
    //verbosity: Assistant.C.Verbose.CONFIGURE
});
