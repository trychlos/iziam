/*
 * /imports/common/providers/jwt-bearer-provider.class.js
 *
 * Defines how a JWT Bearer Token can be used to request an access token [RFC7523]
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import mix from '@vestergaard-company/js-mixin';

import { izProvider } from '/imports/common/classes/iz-provider.class.js';

import { ITokenExtension } from '/imports/common/interfaces/itokenextension.iface.js';

export class JwtBearerProvider extends mix( izProvider ).with( ITokenExtension ){

    // static data

    // static methods

    // private data

    // private methods

    // public data

    /**
     * Constructor
     * @returns {JwtBearerProvider}
     */
    constructor(){
        super({
            iident: {
                id: 'org.trychlos.iziam.provider.jwt.bearer.0',
                label: 'izIAM JWT Bearer Formater',
                origin: 'izIAM'
            },
            ifeatured: [
                'jwt-bearer'
            ],
            itokenextension: [
                'urn:ietf:params:oauth:grant-type:jwt-bearer'
            ],
            irequires: [
                'oauth2'
            ]
        });

        return this;
    }
}
