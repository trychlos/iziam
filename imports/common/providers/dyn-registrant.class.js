/*
 * /imports/common/providers/dyn-registrant.class.js
 *
 * Let an organization accept and manage dynamic client registration.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import mix from '@vestergaard-company/js-mixin';

import { izProvider } from '/imports/common/classes/iz-provider.class.js';

export class OAuth20Provider extends mix( izProvider ).with(){

    // static data

    // static methods

    // private data

    // private methods

    // public data

    /**
     * Constructor
     * @returns {OAuth20Provider}
     */
    constructor(){
        super({
            iident: {
                id: 'org.trychlos.iziam.provider.oauth20.0',
                label: 'izIAM OAUth 2.0 Provider (RFC 6749)',
                origin: 'izIAM'
            },
            ifeatured: [
                'oauth-2.0-6749'
            ]
        });

        // this provider defaults to be selected
        this.defaultSelected( true );

        // this provider defaults to be selected
        this.userSelectable( false );

        return this;
    }
}
