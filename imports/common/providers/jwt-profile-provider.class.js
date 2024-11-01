/*
 * /imports/common/providers/jwt-profile-provider.class.js
 *
 * Defines how to encode access tokens in JWT format [RFC9068]
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import mix from '@vestergaard-company/js-mixin';

import { izProvider } from '/imports/common/classes/iz-provider.class.js';

import { ITokenExtension } from '/imports/common/interfaces/itokenextension.iface.js';

export class JwtProfileProvider extends mix( izProvider ).with( ITokenExtension ){

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
            itokenextension: [
                'jwt_profile'
            ],
            irequires: [
                'oauth2'
            ]
        });

        return this;
    }
}
