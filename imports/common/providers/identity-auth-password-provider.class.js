/*
 * /imports/common/providers/identity-auth-password-provider.class.js
 *
 * Provides Password authentication to identities.
 * 
 * See https://nodejs.org/api/crypto.html#cryptopbkdf2password-salt-iterations-keylen-digest-callback
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import crypto from 'crypto';
import mix from '@vestergaard-company/js-mixin';

import { izProvider } from '/imports/common/classes/iz-provider.class.js';

import { IIdentityAuth } from '/imports/common/interfaces/iidentity-auth.iface.js';

export class IdentityAuthPasswordProvider extends mix( izProvider ).with( IIdentityAuth ){

    // static data

    static acr_0 = 'urn:iziam:password:0';

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
            iidentityauth: [
                IdentityAuthPasswordProvider.acr_0
            ]
        });
        return this;
    }

    /**
     * @param {Object} res an { authenticated, reason, acr } prepared object to be updated with the result
     * @param {Object} identity the found identity
     * @param {String} password the password provided during login interaction
     * @param {Object} client an { entity, record } object
     * @returns {Object} the updated result
     */
    async authenticate( res, identity, password, client ){
        if( identity.password ){
            const p = IdentityAuthPasswordProvider.parms();
            const hashedPassword = crypto.pbkdf2Sync( password, Buffer.from( identity.password.salt, 'hex' ), p.iterations, p.keylen, p.digest );
            if( crypto.timingSafeEqual( Buffer.from( identity.password.hashed, 'hex' ), hashedPassword )){
                res.authenticated = true;
                res.acr = IdentityAuthPasswordProvider.acr_0;
            } else {
                res.reason = Meteor.APP.C.IDENTITY_WRONG_PASSWORD;
            }
        } else {
            res.reason = Meteor.APP.C.IDENTITY_NO_PASSWORD;
        }
        return res;
    }

    /**
     * @param {Object} identity the found identity
     * @param {String} password the provided password
     * @param {Object} client an { entity, record } object
     * @returns {Boolean} whether we are willing to authenticate the provided informations
     */
    async willingTo( identity, password, client ){
        return true;
    }
}
