/*
 * /imports/common/providers/openid-provider.class.js
 *
 * A simple (though mandatory) provider which defines the 'openid' scope.
 */

import _ from 'lodash';
import { strict as assert } from 'node:assert';
import mix from '@vestergaard-company/js-mixin';

import { izProvider } from '/imports/common/classes/iz-provider.class.js';
import { OpenID } from '/imports/common/classes/openid.class.js';
import { Scope } from '/imports/common/classes/scope.class.js';

import { IGrantType } from '/imports/common/interfaces/igranttype.iface.js';
import { IRequestable } from '/imports/common/interfaces/irequestable.iface.js';
import { IScope } from '/imports/common/interfaces/iscope.iface.js';

export class OpenIDProvider extends mix( izProvider ).with( IGrantType, IRequestable, IScope ){

    // static data

    // static methods

    // private data

    // private methods

    // public data

    /**
     * Constructor
     * @returns {OpenIDProvider}
     */
    constructor(){
        super({
            iident: {
                id: 'org.trychlos.iziam.provider.openid.0',
                label: 'izIAM OpenID Provider',
                origin: 'izIAM'
            },
            ifeatured: [
                'openid',
                'openid-connect-1.0'
            ],
            igranttype: [
                'authorization_code',
                'hybrid',
                'implicit'
            ],
            irequestable: [
                {
                    method: 'GET',
                    path: Meteor.APP.C.openidMetadataPath,
                    async fn( url, args, organization ){
                        args.answer( OpenID.fn.metadata( organization ));
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
                'oauth2'
            ],
            // see https://openid.net/specs/openid-connect-core-1_0.html#ScopeClaims
            iscope: [
                Scope.byName( 'openid' ),
                Scope.byName( 'offline_access' )
            ]
        });

        return this;
    }

    /**
     * @locus Server
     * @returns {Object} the options needed to instanciate a RequestServer
     */
    requestOptions(){
        return { auth: 'OIDAuthServer' };
    }
}
