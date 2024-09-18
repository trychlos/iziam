/*
 * /imports/common/definitions/application-type.def.js
 *
 * An optional OpenID client parameter defined in https://openid.net/specs/openid-connect-registration-1_0.html#ClientMetadata:
 * 
 *  OPTIONAL. Kind of the application. The default, if omitted, is web.
 *  The defined values are 'native' or 'web'.
 *  Web Clients using the OAuth Implicit Grant Type MUST only register URLs using the https scheme as redirect_uris; they MUST NOT use localhost as the hostname.
 *  Native Clients MUST only register redirect_uris using custom URI schemes or loopback URLs using the http scheme;
 *  loopback URLs use localhost or the IP loopback literals 127.0.0.1 or [::1] as the hostname. Authorization Servers MAY place additional constraints on Native Clients.
 *  Authorization Servers MAY reject Redirection URI values using the http scheme, other than the loopback case for Native Clients.
 *  The Authorization Server MUST verify that all the registered redirect_uris conform to these constraints. This prevents sharing a Client ID across different types of Clients.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { pwixI18n } from 'meteor/pwix:i18n';

export const ApplicationType = {
    C: [
        {
            id: 'native',
            label: 'definitions.application_type.native_label',
            description: 'definitions.application_type.native_description'
        },
        {
            id: 'web',
            label: 'definitions.application_type.web_label',
            description: 'definitions.application_type.web_description'
        }
    ],

    warnedById: {},

    /**
     * @param {String} id a client type identifier
     * @returns {Object} the client credentials type definition, or null
     */
    byId( id ){
        let found = null;
        this.Knowns().every(( def ) => {
            if( def.id === id ){
                found = def;
            }
            return found === null;
        });
        if( !found && !this.warnedById[id] ){
            console.warn( 'application type not found', id );
            ApplicationType.warnedById[id] = true;
        }
        return found;
    },

    /**
     * @param {Object} def a ApplicationType definition as returned by ApplicationType.Knowns()
     * @returns {String} the description to be attached to the client credential type
     */
    description( def ){
        return pwixI18n.label( I18N, def.description );
    },

    /**
     * @param {Object} def a ApplicationType definition as returned by ApplicationType.Knowns()
     * @returns {String} the client type identifier
     */
    id( def ){
        return def.id;
    },

    /**
     * @returns {Array} the list of managed client credential types
     */
    Knowns(){
        return this.C;
    },

    /**
     * @param {Object} def a ApplicationType definition as returned by ApplicationType.Knowns()
     * @returns {String} the label to be attached to the client credential type
     */
    label( def ){
        return pwixI18n.label( I18N, def.label );
    }
};
