/*
 * /imports/common/providers/oauth20-dyn-registrer.class.js
 *
 * Let an organization accept and manage dynamic OAuth 2 client registration.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import mix from '@vestergaard-company/js-mixin';

import { izProvider } from '/imports/common/classes/iz-provider.class.js';

export class OAuth2DynamicRegistrer extends mix( izProvider ).with(){

    // static data

    // static methods

    // private data

    // private methods

    // public data

    /**
     * Constructor
     * @returns {OAuth2DynamicRegistrer}
     */
    constructor(){
        super({
            iident: {
                id: 'org.trychlos.iziam.provider.oauth2-dynamic-registrer.0',
                label: 'izIAM OAUth 2 Dynamic Registrer (RFC 7591)',
                origin: 'izIAM'
            },
            ifeatured: [
                'oauth2-dynamic-registration'
            ],
            irequires: [
                'oauth2'
            ]
        });

        return this;
    }
}
