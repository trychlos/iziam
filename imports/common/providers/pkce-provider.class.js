/*
 * /imports/common/providers/pkce-provider.class.js
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import mix from '@vestergaard-company/js-mixin';

import { izProvider } from '/imports/common/classes/iz-provider.class.js';

import { Organizations } from '/imports/common/collections/organizations/index.js';

import { ITokenExtension } from '/imports/common/interfaces/itokenextension.iface.js';

export class PkceProvider extends mix( izProvider ).with( ITokenExtension ){

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
                id: 'org.trychlos.iziam.provider.pkce.0',
                label: 'izIAM PKCE Plugin [RFC7636]',
                origin: 'izIAM'
            },
            ifeatured: [
                'rfc7636',
                'pkce'
            ],
            itokenextension: [
                'pkce'
            ]
        });

        return this;
    }

    /**
     * @param {Object} organization as an { entity, record} object
     * @returns {Boolean} whether this provider is mandatory
     */
    isMandatory( organization ){
        return Organizations.fn.wantsPkce( organization );
    }
}
