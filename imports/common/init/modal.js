/*
 * /imports/common/init/modal.js
 */

import { Modal } from 'meteor/pwix:modal';

Modal.configure({
    closeByBackdrop: false,
    //closeByBackdrop: true,
    //verbosity: Modal.C.Verbose.CONFIGURE
});
