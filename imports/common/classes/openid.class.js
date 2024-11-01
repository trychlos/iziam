/*
 * /imports/common/classes/openid.class.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import mix from '@vestergaard-company/js-mixin';

import { _openid_fn } from './openid-fn.js';
import { _openid_scopes } from './openid-scopes.js';

import { OAuth2 } from './oauth2.class.js';

export class OpenID extends mix( OAuth2 ).with(){

    // static data

    // static methods

    static fn = _openid_fn;
    static scopes = _openid_scopes

    // private data

    // private methods

    // protected data

    // public data

    /**
     * Constructor
     * @returns {OpenID}
     */
    constructor(){
        super( ...arguments );
        return this;
    }
}
