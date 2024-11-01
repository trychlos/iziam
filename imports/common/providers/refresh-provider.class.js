/*
 * /imports/common/providers/refresh-provider.class.js
 *
 * Let the client ask for refresh tokens.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import mix from '@vestergaard-company/js-mixin';

import { izProvider } from '/imports/common/classes/iz-provider.class.js';

import { IGrantType } from '/imports/common/interfaces/igranttype.iface.js';

export class RefreshProvider extends mix( izProvider ).with( IGrantType ){

    // static data

    // static methods

    // private data

    // private methods

    // public data

    /**
     * Constructor
     * @returns {RefreshProvider}
     */
    constructor(){
        super({
            iident: {
                id: 'org.trychlos.iziam.provider.refresh.0',
                label: 'izIAM Refresh Token Provider',
                origin: 'izIAM'
            },
            ifeatured: [
                'refresh'
            ],
            igranttype: [
                'refresh_token'
            ],
            irequires: [
                'oauth2'
            ]
        });

        return this;
    }
}
