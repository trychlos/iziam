/*
 * /imports/common/providers/identity-auth-password-provider.class.js
 *
 * Provides Password authentication to identities.
 * 
 * See https://nodejs.org/api/crypto.html#cryptopbkdf2password-salt-iterations-keylen-digest-callback
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import mix from '@vestergaard-company/js-mixin';

import { izProvider } from '/imports/common/classes/iz-provider.class.js';

import { IIdentityAuth } from '/imports/common/interfaces/iidentity-auth.iface.js';

export class IdentityAuthPasswordProvider extends mix( izProvider ).with( IIdentityAuth ){

    // static data

    // static methods

    /**
     * @returns {Object} an object with following keys
     *  - iterations
     *  - keylen
     *  - digest
     */
    static parms(){
        return {
            iterations: 500000,
            keylen: 64,
            digest: 'sha512'
        };
    }

    // private data

    // private methods

    // public data

    /**
     * Constructor
     * @returns {IdentityAuthPasswordProvider}
     */
    constructor(){
        super({
            iident: {
                id: 'org.trychlos.iziam.provider.identity-auth.password.0',
                label: 'izIAM Password Authentication for Identities',
                origin: 'izIAM'
            },
            iidentityauth: null
        });
        return this;
    }
}
