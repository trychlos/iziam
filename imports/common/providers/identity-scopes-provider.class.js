/*
 * /imports/common/providers/identity-scopes-provider.class.js
 *
 * Let the identities publish scopes.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import mix from '@vestergaard-company/js-mixin';

import { izProvider } from '/imports/common/classes/iz-provider.class.js';

import { Identities } from '/imports/common/collections/identities/index.js';

import { IScope } from '/imports/common/interfaces/iscope.iface.js';

export class IdentityScopesProvider extends mix( izProvider ).with( IScope ){

    // static data

    // static methods

    // private data

    // private methods

    // public data

    /**
     * Constructor
     * @returns {IdentityScopesProvider}
     */
    constructor(){

        // first, let the identities register their claims
        Identities.claims.defineClaims();

        // only then, call super with args
        super({
            iident: {
                id: 'org.trychlos.iziam.provider.identity.scopes.0',
                label: 'Identities scopes',
                origin: 'izIAM'
            },
            iscope: Identities.claims.scopes()
        });

        return this;
    }
}
