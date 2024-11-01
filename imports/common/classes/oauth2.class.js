/*
 * /imports/common/classes/oauth2.class.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import mix from '@vestergaard-company/js-mixin';

import { _oauth2_fn } from './oauth2-fn.js';
import { _oauth2_scopes } from './oauth2-scopes.js';

import { izObject } from './iz-object.class.js';

export class OAuth2 extends mix( izObject ).with(){

    // static data

    // static methods

    static fn = _oauth2_fn;
    static scopes = _oauth2_scopes

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
