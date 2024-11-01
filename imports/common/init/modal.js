/*
 * /imports/common/init/modal.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';

import { Modal } from 'meteor/pwix:modal';

Modal.configure({
    closeByBackdrop: false,
    //closeByBackdrop: true,
    //verbosity: Modal.C.Verbose.CONFIGURE
});
