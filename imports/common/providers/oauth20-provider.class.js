/*
 * /imports/common/providers/oauth20-provider.class.js
 *
 * A protocol provider for the OAuth 2.0 RFC 6749 implementation.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import mix from '@vestergaard-company/js-mixin';

import { izProvider } from '/imports/common/classes/iz-provider.class.js';
import { ifError } from 'assert';

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
                'oauth2',
                'oauth-2.0-6749'
            ]
        });

        return this;
    }

    /**
     * @summary Overrides ISelectable.isSelectable() method so that OAuth 2.0 cannot be selected if OAuth 2.1 is already selected
     * @param {Array<String>} selected the list of currently selected providers id's
     * @returns {Boolean} whether this provider is selectable, i.e. when the input checkbox can be enabled to be selected by the user
     */
    isSelectable( selected ){
        let selectable = super.isSelectable( selected );
        if( selectable ){
            if( selected.includes( 'org.trychlos.iziam.provider.oauth21.11' )){
                selectable = false;
            }
        }
        return selectable;
    }
}