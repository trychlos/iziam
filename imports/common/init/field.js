/*
 * /imports/common/init/field.js
 */

import { Field } from 'meteor/pwix:field';

Field.configure({
    prefixes: [ 'oid' ],
    //prefixes: [],
    //verbosity: Field.C.Verbose.CONFIGURE
});
