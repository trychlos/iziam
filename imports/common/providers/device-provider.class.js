/*
 * /imports/common/providers/device-provider.class.js
 *
 * The OAuth 2.0 device authorization grant is designed for Internet-
 * connected devices that either lack a browser to perform a user-agent-
 * based authorization or are input constrained to the extent that
 * requiring the user to input text in order to authenticate during the
 * authorization flow is impractical
 *
 * https://datatracker.ietf.org/doc/html/rfc8628
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;
import mix from '@vestergaard-company/js-mixin';

import { izProvider } from '/imports/common/classes/iz-provider.class.js';

import { IGrantType } from '/imports/common/interfaces/igranttype.iface.js';

export class DeviceProvider extends mix( izProvider ).with( IGrantType ){

    // static data

    // static methods

    // private data

    // private methods

    // public data

    /**
     * Constructor
     * @returns {DeviceProvider}
     */
    constructor(){
        super({
            iident: {
                id: 'org.trychlos.iziam.provider.device.0',
                label: 'izIAM Device Flow Provider (RFC 8628)',
                origin: 'izIAM'
            },
            ifeatured: [
                'device-flow'
            ],
            igranttype: [
                'urn:ietf:params:oauth:grant-type:device_code'
            ],
            irequires: [
                'oauth2'
            ]
        });

        return this;
    }
}
