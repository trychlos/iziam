/*
 * /imports/common/providers/jwt-profile-provider.class.js
 *
 * Defines how to encode access tokens in JWT format [RFC9068]
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import mix from '@vestergaard-company/js-mixin';

import { izProvider } from '/imports/common/classes/iz-provider.class.js';

import { IGrantType } from '/imports/common/interfaces/igranttype.iface.js';

export class JwtProfileProvider extends mix( izProvider ).with( IGrantType ){

    // static data

    // static methods

    // private data

    // private methods

    // public data

    /**
     * Constructor
     * @returns {JwtProfileProvider}
     */
    constructor(){
        super({
            iident: {
                id: 'org.trychlos.iziam.provider.jwt.profile.0',
                label: 'izIAM JWT Profile Formater',
                origin: 'izIAM'
            },
            ifeatured: [
                'jwt-profile'
            ],
            irequires: [
                'oauth2'
            ]
        });

        return this;
    }
}
