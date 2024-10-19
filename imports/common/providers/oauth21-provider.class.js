/*
 * /imports/common/providers/oauth21-provider.class.js
 *
 *  2024- 8- 9: an IETF draft v 11 (may 2024).
 *
 * A protocol provider for the OAuth 2.1 draft v11 implementation.
 * 
 * Exactly one of Oauth 2.0 / OAuth 2.1 must be selected by the organization.
 * Both of these OAuth providers have their own list of defined client types.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import mix from '@vestergaard-company/js-mixin';

import { izProvider } from '/imports/common/classes/iz-provider.class.js';
import { OAuth2 } from '/imports/common/classes/oauth2.class.js';

import { IGrantType } from '/imports/common/interfaces/igranttype.iface.js';
import { IRequestable } from '/imports/common/interfaces/irequestable.iface.js';

export class OAuth21Provider extends mix( izProvider ).with( IGrantType, IRequestable ){

    // static data

    // static methods

    // private data

    // private methods

    // public data

    /**
     * Constructor
     * @returns {OAuth21Provider}
     */
    constructor(){
        super({
            iident: {
                id: 'org.trychlos.iziam.provider.oauth21.11',
                label: 'izIAM OAUth 2.1 Provider (Draft v11)',
                origin: 'izIAM'
            },
            ifeatured: [
                'oauth2',
                'oauth-2.1-draft-v11'
            ],
            // authorization grant types are defined by the draft
            igranttype: [
                'authorization_code',
                'client_credentials'
            ],
            irequestable: [
                {
                    method: 'GET',
                    path: Meteor.APP.C.oauthMetadataPath,
                    fn( url, args, organization ){
                        args.answer( OAuth2.fn.metadata( organization ));
                        args.end();
                        return true;
                    }
                },
                {
                    method: 'GET',
                    path: '*'
                },
                {
                    method: 'POST',
                    path: '*'
                }
            ],
            irequires: [
                'pkce'
            ],
            iselectable: {
                defaultSelected: true
            }
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
            if( selected.includes( 'org.trychlos.iziam.provider.oauth20.0' )){
                selectable = false;
            }
        }
        return selectable;
    }
}
