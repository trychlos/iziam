/*
 * /imports/common/interfaces/iidentity-auth.iface.js
 *
 * Provides an authentication way to identities.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import { DeclareMixin } from '@vestergaard-company/js-mixin';

export const IIdentityAuth = DeclareMixin(( superclass ) => class extends superclass {

    #priv = null;

    /**
     * @param {Object} o an object with following keys:
     *  - iidentityauth: ignored at the moment
     * @returns {IIdentityAuth}
     */
    constructor( o ){
        super( ...arguments );

        if( o && o.iidentityauth ){
            this.#priv = {
                iidentityauth: o.iidentityauth
            };
        }

        return this;
    }
});
