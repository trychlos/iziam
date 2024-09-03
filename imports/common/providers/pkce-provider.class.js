/*
 * /imports/common/providers/pkce-provider.class.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import mix from '@vestergaard-company/js-mixin';

import { izProvider } from '/imports/common/classes/iz-provider.class.js';

import { Organizations } from '/imports/common/collections/organizations/index.js';

import { IGrantType } from '/imports/common/interfaces/igranttype.iface.js';

export class PkceProvider extends mix( izProvider ).with( IGrantType ){

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
            irequires: [
                'authorization_code'
            ],
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
